import type { GridLocaleText } from '@mui/x-data-grid';

export const GRID_DEFAULT_LOCALE_TEXT_EN: GridLocaleText = {
  // Root
  noRowsLabel: 'No rows',
  noResultsOverlayLabel: 'No results found.',
  noColumnsOverlayLabel: 'No columns',
  noColumnsOverlayManageColumns: 'Manage columns',
  emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Density',
  toolbarDensityLabel: 'Density',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comfortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Columns',
  toolbarColumnsLabel: 'Select columns',

  // Filters toolbar button text
  toolbarFilters: 'Filters',
  toolbarFiltersLabel: 'Show filters',
  toolbarFiltersTooltipHide: 'Hide filters',
  toolbarFiltersTooltipShow: 'Show filters',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} active filters` : `${count} active filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Search…',
  toolbarQuickFilterLabel: 'Search',
  toolbarQuickFilterDeleteIconLabel: 'Clear',

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Download as CSV',
  toolbarExportPrint: 'Print',
  toolbarExportExcel: 'Download as Excel',

  // Toolbar pivot button
  toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Search',
  columnsManagementNoColumns: 'No columns',
  columnsManagementShowHideAllText: 'Show/Hide All',
  columnsManagementReset: 'Reset',
  columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Add filter',
  filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Delete',
  filterPanelLogicOperator: 'Logic operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: 'Columns',
  filterPanelInputLabel: 'Value',
  filterPanelInputPlaceholder: 'Filter value',

  // Filter operators text
  filterOperatorContains: 'contains',
  filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'equals',
  filterOperatorDoesNotEqual: 'does not equal',
  filterOperatorStartsWith: 'starts with',
  filterOperatorEndsWith: 'ends with',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is not',
  filterOperatorAfter: 'is after',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',
  filterOperatorIsEmpty: 'is empty',
  filterOperatorIsNotEmpty: 'is not empty',
  filterOperatorIsAnyOf: 'is any of',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Contains',
  headerFilterOperatorDoesNotContain: 'Does not contain',
  headerFilterOperatorEquals: 'Equals',
  headerFilterOperatorDoesNotEqual: 'Does not equal',
  headerFilterOperatorStartsWith: 'Starts with',
  headerFilterOperatorEndsWith: 'Ends with',
  headerFilterOperatorIs: 'Is',
  headerFilterOperatorNot: 'Is not',
  headerFilterOperatorAfter: 'Is after',
  headerFilterOperatorOnOrAfter: 'Is on or after',
  headerFilterOperatorBefore: 'Is before',
  headerFilterOperatorOnOrBefore: 'Is on or before',
  headerFilterOperatorIsEmpty: 'Is empty',
  headerFilterOperatorIsNotEmpty: 'Is not empty',
  headerFilterOperatorIsAnyOf: 'Is any of',
  'headerFilterOperator=': 'Equals',
  'headerFilterOperator!=': 'Not equals',
  'headerFilterOperator>': 'Greater than',
  'headerFilterOperator>=': 'Greater than or equal to',
  'headerFilterOperator<': 'Less than',
  'headerFilterOperator<=': 'Less than or equal to',
  headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'any',
  filterValueTrue: 'true',
  filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Show columns',
  columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Hide column',
  columnMenuUnsort: 'Unsort',
  columnMenuSortAsc: 'Sort by ASC',
  columnMenuSortDesc: 'Sort by DESC',
  columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} active filters` : `${count} active filter`,
  columnHeaderFiltersLabel: 'Show filters',
  columnHeaderSortIconLabel: 'Sort',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rows selected`
      : `${count.toLocaleString()} row selected`,

  // Total row amount footer text
  footerTotalRows: 'Total Rows:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox selection',
  checkboxSelectionSelectAllRows: 'Select all rows',
  checkboxSelectionUnselectAllRows: 'Unselect all rows',
  checkboxSelectionSelectRow: 'Select row',
  checkboxSelectionUnselectRow: 'Unselect row',

  // Boolean cell text
  booleanCellTrueLabel: 'yes',
  booleanCellFalseLabel: 'no',

  // Actions cell more text
  actionsCellMore: 'more',

  // Column pinning text
  pinToLeft: 'Pin to left',
  pinToRight: 'Pin to right',
  unpin: 'Unpin',

  // Tree Data
  treeDataGroupingHeaderName: 'Group',
  treeDataExpand: 'see children',
  treeDataCollapse: 'hide children',

  // Grouping columns
  groupingColumnHeaderName: 'Group',
  groupColumn: (name) => `Group by ${name}`,
  unGroupColumn: (name) => `Stop grouping by ${name}`,

  // Master/detail
  detailPanelToggle: 'Detail panel toggle',
  expandDetailPanel: 'Expand',
  collapseDetailPanel: 'Collapse',

  // Pagination
  paginationRowsPerPage: 'Rows per page:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `around ${estimated}` : `more than ${to}`;
    return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Go to first page';
    }
    if (type === 'last') {
      return 'Go to last page';
    }
    if (type === 'next') {
      return 'Go to next page';
    }
    // if (type === 'previous') {
    return 'Go to previous page';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Row reordering',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregation',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'avg',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'size',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'Rows',
  pivotColumns: 'Columns',
  pivotValues: 'Values',
  pivotCloseButton: 'Close pivot settings',
  pivotSearchButton: 'Search fields',
  pivotSearchControlPlaceholder: 'Search fields',
  pivotSearchControlLabel: 'Search fields',
  pivotSearchControlClear: 'Clear search',
  pivotNoFields: 'No fields',
  pivotMenuMoveUp: 'Move up',
  pivotMenuMoveDown: 'Move down',
  pivotMenuMoveToTop: 'Move to top',
  pivotMenuMoveToBottom: 'Move to bottom',
  pivotMenuRows: 'Rows',
  pivotMenuColumns: 'Columns',
  pivotMenuValues: 'Values',
  pivotMenuOptions: 'Field options',
  pivotMenuAddToRows: 'Add to Rows',
  pivotMenuAddToColumns: 'Add to Columns',
  pivotMenuAddToValues: 'Add to Values',
  pivotMenuRemove: 'Remove',
  pivotDragToRows: 'Drag here to create rows',
  pivotDragToColumns: 'Drag here to create columns',
  pivotDragToValues: 'Drag here to create values',
  pivotYearColumnHeaderName: '(Year)',
  pivotQuarterColumnHeaderName: '(Quarter)',

  // AI Assistant panel
  aiAssistantPanelTitle: 'AI Assistant',
  aiAssistantPanelClose: 'Close AI Assistant',
  aiAssistantPanelNewConversation: 'New conversation',
  aiAssistantPanelConversationHistory: 'Conversation history',
  aiAssistantPanelEmptyConversation: 'No prompt history',
  aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  promptFieldLabel: 'Prompt',
  promptFieldPlaceholder: 'Type a prompt…',
  promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
  promptFieldPlaceholderListening: 'Listening for prompt…',
  promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: 'Send',
  promptFieldRecord: 'Record',
  promptFieldStopRecording: 'Stop recording',

  // Prompt
  promptRerun: 'Run again',
  promptProcessing: 'Processing…',
  promptAppliedChanges: 'Applied changes',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Group by ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Aggregate ${column} (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} is any of: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `Filter where ${column} is any of: ${value}`;
    }
    return `Filter where ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Sort by ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Enable pivot',
  promptChangePivotColumnsLabel: (count: number) => `Columns (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Rows (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Values (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
};
