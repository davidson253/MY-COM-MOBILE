import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaTimes, FaSpinner, FaSave } from "react-icons/fa";
import "./UniversalFormV2.css";

const UniversalFormV2 = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields = [],
  initialValues = {},
  isLoading = false,
  mode = "create", // 'create' ou 'edit'
  validationSchema,
  useDrawer = true, // Utiliser le drawer par défaut
  submitButtonText = "Enregistrer",
  closeOnOverlayClick = true, // Permettre la fermeture en cliquant sur l'overlay
  confirmBeforeClose = false, // Demander confirmation avant de fermer si des données sont modifiées
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const overlayRef = useRef(null);
  const formRef = useRef(null);

  // Détecter si on est sur mobile pour forcer le mode modal
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Réinitialiser l'état des changements quand le formulaire s'ouvre/se ferme
  useEffect(() => {
    if (!isOpen) {
      setHasUnsavedChanges(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Gérer le clic sur l'overlay pour fermer le formulaire
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !isSubmitting) {
      if (closeOnOverlayClick) {
        handleClose();
      }
    }
  };

  // Gérer la fermeture avec confirmation si nécessaire
  const handleClose = () => {
    if (confirmBeforeClose && hasUnsavedChanges) {
      if (
        window.confirm(
          "Vous avez des modifications non sauvegardées. Voulez-vous vraiment fermer le formulaire ?"
        )
      ) {
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Gérer l'échappement clavier
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting, hasUnsavedChanges, confirmBeforeClose]);

  // Générer le schéma de validation automatiquement si non fourni
  const getValidationSchema = () => {
    if (validationSchema) return validationSchema;

    const schema = {};

    // Traiter les champs selon leur structure (groupes ou champs directs)
    const processFields = (fieldsArray) => {
      fieldsArray.forEach((field) => {
        if (field.type === "group" && field.fields) {
          // Si c'est un groupe, traiter récursivement
          processFields(field.fields);
        } else {
          // Traiter le champ individuel
          let fieldSchema;

          switch (field.type) {
            case "email":
              fieldSchema = Yup.string().email("Email invalide");
              break;
            case "number":
              fieldSchema = Yup.number().typeError("Doit être un nombre");
              break;
            case "date":
              fieldSchema = Yup.date().typeError("Date invalide");
              break;
            default:
              fieldSchema = Yup.string();
          }

          if (field.required) {
            fieldSchema = fieldSchema.required(`${field.label} est requis`);
          }

          if (field.min !== undefined) {
            fieldSchema = fieldSchema.min(
              field.min,
              `Minimum ${field.min} caractères`
            );
          }

          if (field.max !== undefined) {
            fieldSchema = fieldSchema.max(
              field.max,
              `Maximum ${field.max} caractères`
            );
          }

          schema[field.name || field.key] = fieldSchema;
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

    return Yup.object().shape(schema);
  };

  // Préparer les valeurs initiales
  const getInitialValues = () => {
    const values = {};

    const processFields = (fieldsArray) => {
      fieldsArray.forEach((field) => {
        if (field.type === "group" && field.fields) {
          processFields(field.fields);
        } else {
          const fieldName = field.name || field.key;
          values[fieldName] =
            initialValues[fieldName] || field.defaultValue || "";
        }
      });
    };

    if (fields && fields.groups) {
      fields.groups.forEach((group) => {
        processFields(group.fields);
      });
    } else {
      processFields(fields);
    }

    return values;
  };

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      // Gérer les erreurs spécifiques aux champs si nécessaire
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setFieldError(field, message);
        });
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Rendu d'un champ individuel
  const renderField = (field, index) => {
    const fieldName = field.name || field.key;
    const uniqueKey = `${fieldName}-${index || 0}`;

    switch (field.type) {
      case "textarea":
        return (
          <div className="form-field" key={uniqueKey}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <Field
              as="textarea"
              name={fieldName}
              className="form-textarea"
              placeholder={field.placeholder}
              rows={field.rows || 3}
              disabled={isSubmitting || isLoading}
            />
            <ErrorMessage
              name={fieldName}
              component="span"
              className="form-error"
            />
          </div>
        );

      case "select":
        return (
          <div className="form-field" key={uniqueKey}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <Field
              as="select"
              name={fieldName}
              className="form-select"
              disabled={isSubmitting || isLoading}
            >
              <option value="">Sélectionner...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name={fieldName}
              component="span"
              className="form-error"
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="form-field checkbox-field" key={uniqueKey}>
            <div className="checkbox-container">
              <Field
                type="checkbox"
                name={fieldName}
                className="form-checkbox"
                disabled={isSubmitting || isLoading}
              />
              <label className="checkbox-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
            </div>
            <ErrorMessage
              name={fieldName}
              component="span"
              className="form-error"
            />
          </div>
        );

      default:
        return (
          <div className="form-field" key={uniqueKey}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <Field
              type={field.type || "text"}
              name={fieldName}
              className="form-input"
              placeholder={field.placeholder}
              disabled={isSubmitting || isLoading}
            />
            <ErrorMessage
              name={fieldName}
              component="span"
              className="form-error"
            />
          </div>
        );
    }
  };

  // Rendu des champs (avec support des groupes)
  const renderFields = () => {
    if (fields && fields.groups) {
      // Nouveau format avec groupes
      return fields.groups.map((group, index) => (
        <div key={index} className="form-group">
          <h3 className="group-title">{group.title}</h3>
          <div className="group-fields">
            {group.fields.map((field, fieldIndex) =>
              renderField(field, fieldIndex)
            )}
          </div>
        </div>
      ));
    } else {
      // Ancien format : champs directs
      return fields.map((field, index) => renderField(field, index));
    }
  };

  if (!isOpen) return null;

  // Déterminer le type d'interface (drawer vs modal)
  const useModalLayout = isMobile || !useDrawer;
  const containerClass = useModalLayout
    ? "universal-form-modal-layout"
    : "universal-form-drawer-layout";

  return (
    <div
      className={`universal-form-overlay ${containerClass}`}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div
        className={`universal-form-container ${
          useModalLayout ? "modal-container" : "drawer-container"
        }`}
      >
        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={handleFormSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting: formikSubmitting, dirty, values }) => {
            // Utiliser une référence pour stocker la valeur précédente
            const previousDirtyRef = React.useRef(dirty);

            // Mettre à jour l'état seulement si la valeur dirty change vraiment
            if (previousDirtyRef.current !== dirty) {
              previousDirtyRef.current = dirty;
              // Utiliser une callback asynchrone pour éviter le setState pendant le render
              Promise.resolve().then(() => {
                setHasUnsavedChanges(dirty);
              });
            }

            return (
              <Form className="universal-form" ref={formRef}>
                {/* En-tête */}
                <div className="form-header">
                  <h2 className="form-title">{title}</h2>
                  <button
                    type="button"
                    className="form-close-btn"
                    onClick={handleClose}
                    disabled={isSubmitting || formikSubmitting}
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Contenu */}
                <div className="form-content">
                  <div className="form-fields">{renderFields()}</div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={handleClose}
                    disabled={isSubmitting || formikSubmitting}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || formikSubmitting || isLoading}
                  >
                    {isSubmitting || formikSubmitting || isLoading ? (
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
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default UniversalFormV2;
