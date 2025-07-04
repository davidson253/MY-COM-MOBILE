-- Script de vérification de la cohérence des données
-- Vérification que toutes les entités ont bien usera dans ('R001','R002')

-- 1. Vérification des représentants
SELECT 'REPRESENTANTS' as table_name, COUNT(*) as total FROM representant WHERE code IN ('R001', 'R002');

-- 2. Vérification des articles (usera doit être R001 ou R002)
SELECT 'ARTICLES' as table_name, 
       COUNT(*) as total, 
       COUNT(CASE WHEN usera IN ('R001', 'R002') THEN 1 END) as avec_representant_valide,
       GROUP_CONCAT(DISTINCT usera) as valeurs_usera
FROM article;

-- 3. Vérification des clients (coderep doit être R001 ou R002)
SELECT 'CLIENTS' as table_name, 
       COUNT(*) as total, 
       COUNT(CASE WHEN coderep IN ('R001', 'R002') THEN 1 END) as avec_representant_valide,
       GROUP_CONCAT(DISTINCT coderep) as valeurs_coderep
FROM client;

-- 4. Vérification des commandes ebcw (coderep doit être R001 ou R002)
SELECT 'COMMANDES_EBCW' as table_name, 
       COUNT(*) as total, 
       COUNT(CASE WHEN coderep IN ('R001', 'R002') THEN 1 END) as avec_representant_valide,
       GROUP_CONCAT(DISTINCT coderep) as valeurs_coderep
FROM ebcw;

-- 5. Vérification des lignes de commande lbcw (coderep doit être R001 ou R002)
SELECT 'LIGNES_COMMANDE_LBCW' as table_name, 
       COUNT(*) as total, 
       COUNT(CASE WHEN coderep IN ('R001', 'R002') THEN 1 END) as avec_representant_valide,
       GROUP_CONCAT(DISTINCT coderep) as valeurs_coderep
FROM lbcw;

-- 6. Vérification des règlements (usera et coderep doivent être R001 ou R002)
SELECT 'REGLEMENTS' as table_name, 
       COUNT(*) as total, 
       COUNT(CASE WHEN usera IN ('R001', 'R002') AND coderep IN ('R001', 'R002') THEN 1 END) as avec_representant_valide,
       GROUP_CONCAT(DISTINCT usera) as valeurs_usera,
       GROUP_CONCAT(DISTINCT coderep) as valeurs_coderep
FROM reglementw;

-- 7. Vérification de la cohérence entre commandes et lignes
SELECT 'COHERENCE_COMMANDES' as verification,
       COUNT(DISTINCT e.numbc) as commandes_total,
       COUNT(DISTINCT l.numbc) as commandes_avec_lignes,
       (COUNT(DISTINCT e.numbc) - COUNT(DISTINCT l.numbc)) as commandes_sans_lignes
FROM ebcw e
LEFT JOIN lbcw l ON e.numbc = l.numbc;

-- 8. Détail des commandes par représentant
SELECT 'DETAIL_COMMANDES_PAR_REP' as verification,
       e.coderep,
       e.librep,
       COUNT(*) as nb_commandes,
       SUM(e.mttc) as total_ttc,
       GROUP_CONCAT(e.numbc) as numeros_bc
FROM ebcw e
GROUP BY e.coderep, e.librep
ORDER BY e.coderep;

-- 9. Articles utilisés dans les commandes
SELECT 'ARTICLES_DANS_COMMANDES' as verification,
       l.codeart,
       l.libart,
       COUNT(*) as nb_lignes,
       SUM(l.qte) as qte_totale,
       GROUP_CONCAT(DISTINCT l.numbc) as commandes
FROM lbcw l
GROUP BY l.codeart, l.libart
ORDER BY l.codeart;

-- 10. Test d'une requête similaire à celle du ticket
SELECT 'TEST_REQUETE_TICKET' as verification,
       'Commande numbc=1' as info,
       e.numbc,
       e.datebc,
       e.rsocf as client,
       e.mttc,
       l.codeart,
       l.libart,
       l.qte,
       l.puart,
       (l.qte * l.puart) as total_ligne
FROM ebcw e
LEFT JOIN lbcw l ON e.numbc = l.numbc
WHERE e.numbc = 1
ORDER BY l.codeart;
