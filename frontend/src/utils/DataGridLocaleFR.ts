import type { GridLocaleText } from '@mui/x-data-grid';

export const GRID_DEFAULT_LOCALE_TEXT_FR: GridLocaleText = {
  // Root
  noRowsLabel: 'Aucune ligne',
  noResultsOverlayLabel: 'Aucun résultat trouvé.',
  noColumnsOverlayLabel: 'Aucune colonne',
  noColumnsOverlayManageColumns: 'Gérer les colonnes',
  emptyPivotOverlayLabel:
    'Ajoutez des champs aux lignes, colonnes et valeurs pour créer un tableau croisé dynamique',

  // Density selector toolbar button text
  toolbarDensity: 'Densité',
  toolbarDensityLabel: 'Densité',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Confortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Colonnes',
  toolbarColumnsLabel: 'Sélectionner les colonnes',

  // Filters toolbar button text
  toolbarFilters: 'Filtres',
  toolbarFiltersLabel: 'Afficher les filtres',
  toolbarFiltersTooltipHide: 'Masquer les filtres',
  toolbarFiltersTooltipShow: 'Afficher les filtres',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtres actifs` : `${count} filtre actif`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Rechercher…',
  toolbarQuickFilterLabel: 'Rechercher',
  toolbarQuickFilterDeleteIconLabel: 'Effacer',

  // Export selector toolbar button text
  toolbarExport: 'Exporter',
  toolbarExportLabel: 'Exporter',
  toolbarExportCSV: 'Télécharger en CSV',
  toolbarExportPrint: 'Imprimer',
  toolbarExportExcel: 'Télécharger en Excel',

  // Toolbar pivot button
  toolbarPivot: 'Tableau croisé',

  // Toolbar AI Assistant button
  toolbarAssistant: 'Assistant IA',

  // Columns management text
  columnsManagementSearchTitle: 'Rechercher',
  columnsManagementNoColumns: 'Aucune colonne',
  columnsManagementShowHideAllText: 'Afficher/Masquer tout',
  columnsManagementReset: 'Réinitialiser',
  columnsManagementDeleteIconLabel: 'Effacer',

  // Filter panel text
  filterPanelAddFilter: 'Ajouter un filtre',
  filterPanelRemoveAll: 'Supprimer tout',
  filterPanelDeleteIconLabel: 'Supprimer',
  filterPanelLogicOperator: 'Opérateur logique',
  filterPanelOperator: 'Opérateur',
  filterPanelOperatorAnd: 'Et',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colonnes',
  filterPanelInputLabel: 'Valeur',
  filterPanelInputPlaceholder: 'Valeur du filtre',

  // Filter operators text
  filterOperatorContains: 'contient',
  filterOperatorDoesNotContain: 'ne contient pas',
  filterOperatorEquals: 'égal à',
  filterOperatorDoesNotEqual: 'différent de',
  filterOperatorStartsWith: 'commence par',
  filterOperatorEndsWith: 'se termine par',
  filterOperatorIs: 'est',
  filterOperatorNot: "n'est pas",
  filterOperatorAfter: 'est après',
  filterOperatorOnOrAfter: 'est le ou après',
  filterOperatorBefore: 'est avant',
  filterOperatorOnOrBefore: 'est le ou avant',
  filterOperatorIsEmpty: 'est vide',
  filterOperatorIsNotEmpty: "n'est pas vide",
  filterOperatorIsAnyOf: "est l'un de",
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Contient',
  headerFilterOperatorDoesNotContain: 'Ne contient pas',
  headerFilterOperatorEquals: 'Égal à',
  headerFilterOperatorDoesNotEqual: 'Différent de',
  headerFilterOperatorStartsWith: 'Commence par',
  headerFilterOperatorEndsWith: 'Se termine par',
  headerFilterOperatorIs: 'Est',
  headerFilterOperatorNot: "N'est pas",
  headerFilterOperatorAfter: 'Est après',
  headerFilterOperatorOnOrAfter: 'Est le ou après',
  headerFilterOperatorBefore: 'Est avant',
  headerFilterOperatorOnOrBefore: 'Est le ou avant',
  headerFilterOperatorIsEmpty: 'Est vide',
  headerFilterOperatorIsNotEmpty: "N'est pas vide",
  headerFilterOperatorIsAnyOf: "Est l'un de",
  'headerFilterOperator=': 'Égal à',
  'headerFilterOperator!=': 'Différent de',
  'headerFilterOperator>': 'Supérieur à',
  'headerFilterOperator>=': 'Supérieur ou égal à',
  'headerFilterOperator<': 'Inférieur à',
  'headerFilterOperator<=': 'Inférieur ou égal à',
  headerFilterClear: 'Effacer le filtre',

  // Filter values text
  filterValueAny: 'tout',
  filterValueTrue: 'vrai',
  filterValueFalse: 'faux',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuAriaLabel: (columnName: string) => `Menu de la colonne ${columnName}`,
  columnMenuShowColumns: 'Afficher les colonnes',
  columnMenuManageColumns: 'Gérer les colonnes',
  columnMenuFilter: 'Filtrer',
  columnMenuHideColumn: 'Masquer la colonne',
  columnMenuUnsort: 'Annuler le tri',
  columnMenuSortAsc: 'Trier par ordre croissant',
  columnMenuSortDesc: 'Trier par ordre décroissant',
  columnMenuManagePivot: 'Gérer le tableau croisé',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtres actifs` : `${count} filtre actif`,
  columnHeaderFiltersLabel: 'Afficher les filtres',
  columnHeaderSortIconLabel: 'Trier',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} lignes sélectionnées`
      : `${count.toLocaleString()} ligne sélectionnée`,

  // Total row amount footer text
  footerTotalRows: 'Total des lignes :',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Sélection par case à cocher',
  checkboxSelectionSelectAllRows: 'Sélectionner toutes les lignes',
  checkboxSelectionUnselectAllRows: 'Désélectionner toutes les lignes',
  checkboxSelectionSelectRow: 'Sélectionner la ligne',
  checkboxSelectionUnselectRow: 'Désélectionner la ligne',

  // Boolean cell text
  booleanCellTrueLabel: 'oui',
  booleanCellFalseLabel: 'non',

  // Actions cell more text
  actionsCellMore: 'plus',

  // Column pinning text
  pinToLeft: 'Épingler à gauche',
  pinToRight: 'Épingler à droite',
  unpin: 'Désépingler',

  // Tree Data
  treeDataGroupingHeaderName: 'Groupe',
  treeDataExpand: 'voir les enfants',
  treeDataCollapse: 'masquer les enfants',

  // Grouping columns
  groupingColumnHeaderName: 'Groupe',
  groupColumn: (name) => `Grouper par ${name}`,
  unGroupColumn: (name) => `Arrêter de grouper par ${name}`,

  // Master/detail
  detailPanelToggle: 'Basculer le panneau de détails',
  expandDetailPanel: 'Développer',
  collapseDetailPanel: 'Réduire',

  // Pagination
  paginationRowsPerPage: 'Lignes par page :',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} sur ${count !== -1 ? count : `plus de ${to}`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `environ ${estimated}` : `plus de ${to}`;
    return `${from}–${to} sur ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Aller à la première page';
    }
    if (type === 'last') {
      return 'Aller à la dernière page';
    }
    if (type === 'next') {
      return 'Aller à la page suivante';
    }
    // if (type === 'previous') {
    return 'Aller à la page précédente';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Réorganisation des lignes',

  // Aggregation
  aggregationMenuItemHeader: 'Agrégation',
  aggregationFunctionLabelSum: 'somme',
  aggregationFunctionLabelAvg: 'moyenne',
  aggregationFunctionLabelMin: 'minimum',
  aggregationFunctionLabelMax: 'maximum',
  aggregationFunctionLabelSize: 'taille',

  // Pivot panel
  pivotToggleLabel: 'Tableau croisé',
  pivotRows: 'Lignes',
  pivotColumns: 'Colonnes',
  pivotValues: 'Valeurs',
  pivotCloseButton: 'Fermer les paramètres du tableau croisé',
  pivotSearchButton: 'Rechercher des champs',
  pivotSearchControlPlaceholder: 'Rechercher des champs',
  pivotSearchControlLabel: 'Rechercher des champs',
  pivotSearchControlClear: 'Effacer la recherche',
  pivotNoFields: 'Aucun champ',
  pivotMenuMoveUp: 'Déplacer vers le haut',
  pivotMenuMoveDown: 'Déplacer vers le bas',
  pivotMenuMoveToTop: 'Déplacer en haut',
  pivotMenuMoveToBottom: 'Déplacer en bas',
  pivotMenuRows: 'Lignes',
  pivotMenuColumns: 'Colonnes',
  pivotMenuValues: 'Valeurs',
  pivotMenuOptions: 'Options du champ',
  pivotMenuAddToRows: 'Ajouter aux lignes',
  pivotMenuAddToColumns: 'Ajouter aux colonnes',
  pivotMenuAddToValues: 'Ajouter aux valeurs',
  pivotMenuRemove: 'Supprimer',
  pivotDragToRows: 'Glissez ici pour créer des lignes',
  pivotDragToColumns: 'Glissez ici pour créer des colonnes',
  pivotDragToValues: 'Glissez ici pour créer des valeurs',
  pivotYearColumnHeaderName: '(Année)',
  pivotQuarterColumnHeaderName: '(Trimestre)',

  // AI Assistant panel
  aiAssistantPanelTitle: 'Assistant IA',
  aiAssistantPanelClose: "Fermer l'Assistant IA",
  aiAssistantPanelNewConversation: 'Nouvelle conversation',
  aiAssistantPanelConversationHistory: 'Historique des conversations',
  aiAssistantPanelEmptyConversation: 'Aucun historique de prompts',
  aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  promptFieldLabel: 'Prompt',
  promptFieldPlaceholder: 'Tapez un prompt…',
  promptFieldPlaceholderWithRecording: 'Tapez ou enregistrez un prompt…',
  promptFieldPlaceholderListening: 'Écoute du prompt…',
  promptFieldSpeechRecognitionNotSupported:
    "La reconnaissance vocale n'est pas prise en charge dans ce navigateur",
  promptFieldSend: 'Envoyer',
  promptFieldRecord: 'Enregistrer',
  promptFieldStopRecording: "Arrêter l'enregistrement",

  // Prompt
  promptRerun: 'Relancer',
  promptProcessing: 'Traitement…',
  promptAppliedChanges: 'Modifications appliquées',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Grouper par ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Agréger ${column} (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} est l'un de : ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `Filtrer où ${column} est l'un de : ${value}`;
    }
    return `Filtrer où ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Trier par ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Tableau croisé',
  promptChangePivotEnableDescription: 'Activer le tableau croisé',
  promptChangePivotColumnsLabel: (count: number) => `Colonnes (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Lignes (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Valeurs (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
};
