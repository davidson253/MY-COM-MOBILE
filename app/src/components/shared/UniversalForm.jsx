import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import "./UniversalForm.css";

const UniversalForm = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  isLoading = false,
  submitButtonText = "Enregistrer",
  width = "600px",
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Initialiser les données du formulaire
      const initialFormData = {};

      const processFields = (fieldsArray) => {
        fieldsArray?.forEach((field) => {
          if (field.type === "group" && field.fields) {
            // Si c'est un groupe (ancien format), traiter récursivement les champs du groupe
            processFields(field.fields);
          } else {
            // Sinon, initialiser le champ normalement
            initialFormData[field.name] =
              initialData[field.name] || field.defaultValue || "";
          }
        });
      };

      // Support pour le nouveau format avec groupes
      if (fields && fields.groups) {
        fields.groups.forEach((group) => {
          processFields(group.fields);
        });
      } else {
        // Ancien format : tableau de champs directement
        processFields(fields);
      }

      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]); // Retirer fields et initialData des dépendances

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Effacer l'erreur si l'utilisateur corrige le champ
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fields) return true;

    const validateFields = (fieldsArray) => {
      fieldsArray.forEach((field) => {
        if (field.type === "group" && field.fields) {
          // Si c'est un groupe (ancien format), valider récursivement les champs du groupe
          validateFields(field.fields);
        } else {
          // Valider le champ
          const value = formData[field.name];

          // Validation des champs requis
          if (field.required && (!value || value.toString().trim() === "")) {
            newErrors[field.name] = `${field.label} est requis`;
            return;
          }

          // Validation personnalisée
          if (value && field.validation) {
            const validationResult = field.validation(value);
            if (validationResult !== true) {
              newErrors[field.name] = validationResult;
            }
          }
        }
      });
    };

    // Support pour le nouveau format avec groupes
    if (fields && fields.groups) {
      fields.groups.forEach((group) => {
        validateFields(group.fields);
      });
    } else {
      // Ancien format : tableau de champs directement
      validateFields(fields);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";
    const hasError = errors[field.name];

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <input
            type={field.type}
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || isLoading}
            className={`form-input ${hasError ? "error" : ""}`}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || isLoading}
            rows={field.rows || 3}
            className={`form-textarea ${hasError ? "error" : ""}`}
          />
        );

      case "select":
        return (
          <select
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            disabled={field.disabled || isLoading}
            className={`form-select ${hasError ? "error" : ""}`}
          >
            <option value="">-- Sélectionner --</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            disabled={field.disabled || isLoading}
            className={`form-input ${hasError ? "error" : ""}`}
          />
        );

      case "checkbox":
        return (
          <div className="checkbox-container">
            <input
              type="checkbox"
              id={field.name}
              checked={value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              disabled={field.disabled || isLoading}
              className="form-checkbox"
            />
            <label htmlFor={field.name} className="checkbox-label">
              {field.checkboxLabel || field.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="universal-form-overlay">
      <div className="universal-form-modal" style={{ width }}>
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="form-close-btn"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-fields">
            {/* Support pour le nouveau format avec groupes */}
            {fields && fields.groups
              ? fields.groups.map((group, groupIndex) => (
                  <div
                    key={group.key || `group-${groupIndex}`}
                    className="form-group"
                  >
                    <h3 className="group-title">{group.title}</h3>
                    <div className="group-fields">
                      {group.fields?.map((field) => (
                        <div
                          key={field.name}
                          className={`form-field ${
                            field.type === "checkbox" ? "checkbox-field" : ""
                          }`}
                        >
                          {field.type !== "checkbox" && (
                            <label htmlFor={field.name} className="form-label">
                              {field.label}
                              {field.required && (
                                <span className="required">*</span>
                              )}
                            </label>
                          )}

                          {renderField(field)}

                          {errors[field.name] && (
                            <span className="form-error">
                              {errors[field.name]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              : /* Ancien format : tableau de champs directement */
                fields?.map((field, index) => {
                  // Si c'est un groupe (ancien format), afficher le titre du groupe
                  if (field.type === "group") {
                    return (
                      <div
                        key={field.name || `group-${index}`}
                        className="form-group"
                      >
                        <h3 className="group-title">{field.label}</h3>
                        <div className="group-fields">
                          {field.fields?.map((groupField) => (
                            <div
                              key={groupField.name}
                              className={`form-field ${
                                groupField.type === "checkbox"
                                  ? "checkbox-field"
                                  : ""
                              }`}
                            >
                              {groupField.type !== "checkbox" && (
                                <label
                                  htmlFor={groupField.name}
                                  className="form-label"
                                >
                                  {groupField.label}
                                  {groupField.required && (
                                    <span className="required">*</span>
                                  )}
                                </label>
                              )}

                              {renderField(groupField)}

                              {errors[groupField.name] && (
                                <span className="form-error">
                                  {errors[groupField.name]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Sinon, afficher le champ normalement
                  return (
                    <div
                      key={field.name}
                      className={`form-field ${
                        field.type === "checkbox" ? "checkbox-field" : ""
                      }`}
                    >
                      {field.type !== "checkbox" && (
                        <label htmlFor={field.name} className="form-label">
                          {field.label}
                          {field.required && (
                            <span className="required">*</span>
                          )}
                        </label>
                      )}

                      {renderField(field)}

                      {errors[field.name] && (
                        <span className="form-error">{errors[field.name]}</span>
                      )}
                    </div>
                  );
                })}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
              disabled={isLoading}
            >
              <FaTimes />
              Annuler
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <FaSave />
                  {submitButtonText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversalForm;
