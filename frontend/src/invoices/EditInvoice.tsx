import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { AppDispatch, RootState } from '../store';
import { fetchInvoice, updateInvoiceAction } from './store/slice';
import { fetchProjects } from '../projects/store/slice';
import type { InvoiceFormData, InvoiceStatus } from './types';
import type { Project } from '../projects/types';
import { PAYMENT_TYPE_OPTIONS, formatPrice, calculateInvoiceTotal } from './utils';
import PrimaryButton from '../components/PrimaryButton';
import BackButton from '../components/BackButton';
import ConfirmationModal from '../components/ConfirmationModal';

const schema = yup.object().shape({
  project_id: yup.number().required('validation.required'),
  invoice_number: yup.string().required('validation.required'),
  status: yup
    .number()
    .required('validation.required')
    .oneOf([0, 1, 2, 3])
    .transform((value) => Number(value)),
  issue_date: yup.string().required('validation.required'),
  payment_due_date: yup.string().required('validation.required'),
  payment_type: yup.string().required('validation.required'),
  actual_payment_date: yup.string(),
  footer_note: yup.string(),
  invoice_lines: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required('validation.required'),
        unit_price: yup.number().required('validation.required').min(0.01, 'validation.priceMin'),
        quantity: yup.number().required('validation.required').min(1, 'validation.quantityMin'),
      })
    )
    .min(1, 'validation.linesRequired'),
}) as yup.ObjectSchema<InvoiceFormData>;

const EditInvoice: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { currentInvoice, loading } = useSelector((state: RootState) => state.invoices);

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [showPaidConfirmation, setShowPaidConfirmation] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<InvoiceStatus | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      project_id: 0,
      invoice_number: '',
      status: 0 as InvoiceStatus,
      issue_date: '',
      payment_due_date: '',
      payment_type: 'bank_transfer',
      actual_payment_date: '',
      footer_note: '',
      invoice_lines: [
        {
          description: '',
          unit_price: 0,
          quantity: 1,
        },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'invoice_lines',
  });

  const watchInvoiceLines = watch('invoice_lines');
  const watchStatus = watch('status');

  // Charger les projets et la facture au montage
  useEffect(() => {
    dispatch(fetchProjects({}));
    if (id) {
      dispatch(fetchInvoice(parseInt(id)));
    }
  }, [dispatch, id]);

  // Pré-remplir le formulaire avec les données de la facture existante
  useEffect(() => {
    if (currentInvoice && !initialDataLoaded) {
      const formattedInvoiceLines =
        currentInvoice.invoice_lines && currentInvoice.invoice_lines.length > 0
          ? currentInvoice.invoice_lines.map((line) => ({
              description: line.description,
              unit_price: line.unit_price,
              quantity: line.quantity,
            }))
          : [
              {
                description: '',
                unit_price: 0,
                quantity: 1,
              },
            ];

      reset({
        project_id: currentInvoice.project_id,
        invoice_number: currentInvoice.invoice_number,
        status: currentInvoice.status,
        issue_date: currentInvoice.issue_date.split('T')[0],
        payment_due_date: currentInvoice.payment_due_date.split('T')[0],
        payment_type: currentInvoice.payment_type,
        actual_payment_date: currentInvoice.actual_payment_date
          ? currentInvoice.actual_payment_date.split('T')[0]
          : '',
        footer_note: currentInvoice.footer_note || '',
        invoice_lines: formattedInvoiceLines,
      });

      // Remplacer les lignes de la facture dans le formulaire
      replace(formattedInvoiceLines);
      setInitialDataLoaded(true);
    }
  }, [currentInvoice, reset, replace, initialDataLoaded]);

  // Gérer la confirmation pour le passage à l'état payé
  const handleStatusChange = (newStatus: InvoiceStatus) => {
    if (newStatus === 3 && currentInvoice?.status !== 3) {
      // L'utilisateur veut passer à l'état payé
      setPendingStatusChange(newStatus);
      setShowPaidConfirmation(true);
    } else {
      // Changement normal, pas besoin de confirmation
      setValue('status', newStatus);
      if (newStatus === 3) {
        // Si on passe à payé, mettre la date du jour par défaut
        setValue('actual_payment_date', new Date().toISOString().split('T')[0]);
      }
    }
  };

  const handleConfirmPaidStatus = () => {
    if (pendingStatusChange !== null) {
      setValue('status', pendingStatusChange);
      setValue('actual_payment_date', new Date().toISOString().split('T')[0]);
    }
    setShowPaidConfirmation(false);
    setPendingStatusChange(null);
  };

  const handleCancelPaidStatus = () => {
    setShowPaidConfirmation(false);
    setPendingStatusChange(null);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    if (!id) return;

    try {
      await dispatch(updateInvoiceAction({ id: parseInt(id), invoiceData: data })).unwrap();
      navigate(`/invoices/${id}`);
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    }
  };

  const addInvoiceLine = () => {
    append({
      description: '',
      unit_price: 0,
      quantity: 1,
    });
  };

  const removeInvoiceLine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    return calculateInvoiceTotal(watchInvoiceLines || []);
  };

  const canEdit = currentInvoice?.status !== 3; // 3 = payée

  if (loading || !currentInvoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
          gap: { xs: 2, sm: 2 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}
      >
        <BackButton />
        <Typography
          component='h1'
          variant='h4'
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {intl.formatMessage({ id: 'invoices.edit.title' })}
        </Typography>
      </Box>

      {/* Message d'information si facture payée */}
      {!canEdit && (
        <Paper
          sx={{
            padding: '16px',
            mb: 3,
            backgroundColor: '#d4edda',
            borderLeft: '4px solid #28a745',
          }}
        >
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {intl.formatMessage({ id: 'invoices.edit.paidWarning' })}
          </Typography>
        </Paper>
      )}

      {/* Formulaire */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: '20px', sm: '40px' },
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        }}
      >
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            '& .MuiFormControl-root': {
              width: '100%',
            },
          }}
        >
          {/* Informations de base */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'invoices.form.basicInfo' })}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Controller
              name='project_id'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.project_id}>
                  <InputLabel shrink required>
                    {intl.formatMessage({ id: 'invoices.form.project' })}
                  </InputLabel>
                  <Select
                    {...field}
                    label={intl.formatMessage({ id: 'invoices.form.project' })}
                    disabled={!canEdit}
                    displayEmpty
                  >
                    <MenuItem value={0} disabled>
                      <em>{intl.formatMessage({ id: 'invoices.form.selectProject' })}</em>
                    </MenuItem>
                    {projects.map((project: Project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name} - {project.client?.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.project_id && (
                    <FormHelperText>
                      {intl.formatMessage({ id: errors.project_id.message })}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name='invoice_number'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  disabled={true}
                  label={intl.formatMessage({ id: 'invoices.form.number' })}
                  error={!!errors.invoice_number}
                  helperText={
                    errors.invoice_number
                      ? intl.formatMessage({ id: errors.invoice_number.message })
                      : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  sx={{
                    '& .MuiInputBase-input': {
                      color: '#333333',
                    },
                  }}
                />
              )}
            />

            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel shrink required>
                    {intl.formatMessage({ id: 'invoices.form.status' })}
                  </InputLabel>
                  <Select
                    {...field}
                    onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus)}
                    label={intl.formatMessage({ id: 'invoices.form.status' })}
                    disabled={!canEdit}
                  >
                    <MenuItem value={0}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#9e9e9e',
                          }}
                        />
                        {intl.formatMessage({ id: 'invoices.status.draft' })}
                      </Box>
                    </MenuItem>
                    <MenuItem value={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#2196f3',
                          }}
                        />
                        {intl.formatMessage({ id: 'invoices.status.edited' })}
                      </Box>
                    </MenuItem>
                    <MenuItem value={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#ff9800',
                          }}
                        />
                        {intl.formatMessage({ id: 'invoices.status.sent' })}
                      </Box>
                    </MenuItem>
                    <MenuItem value={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                          }}
                        />
                        {intl.formatMessage({ id: 'invoices.status.paid' })}
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText>
                      {intl.formatMessage({ id: errors.status.message })}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name='issue_date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type='date'
                  label={intl.formatMessage({ id: 'invoices.form.issueDate' })}
                  error={!!errors.issue_date}
                  helperText={
                    errors.issue_date ? intl.formatMessage({ id: errors.issue_date.message }) : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  disabled={!canEdit}
                />
              )}
            />

            <Controller
              name='payment_due_date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type='date'
                  label={intl.formatMessage({ id: 'invoices.form.dueDate' })}
                  error={!!errors.payment_due_date}
                  helperText={
                    errors.payment_due_date
                      ? intl.formatMessage({ id: errors.payment_due_date.message })
                      : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  disabled={!canEdit}
                />
              )}
            />

            <Controller
              name='payment_type'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.payment_type}>
                  <InputLabel shrink required>
                    {intl.formatMessage({ id: 'invoices.form.paymentType' })}
                  </InputLabel>
                  <Select
                    {...field}
                    label={intl.formatMessage({ id: 'invoices.form.paymentType' })}
                    disabled={!canEdit}
                  >
                    {PAYMENT_TYPE_OPTIONS.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {intl.formatMessage({ id: type.label })}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.payment_type && (
                    <FormHelperText>
                      {intl.formatMessage({ id: errors.payment_type.message })}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Date de paiement effective (si statut payé) */}
            {watchStatus === 3 && (
              <Controller
                name='actual_payment_date'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='date'
                    label={intl.formatMessage({ id: 'invoices.form.actualPaymentDate' })}
                    error={!!errors.actual_payment_date}
                    helperText={
                      errors.actual_payment_date
                        ? intl.formatMessage({ id: errors.actual_payment_date.message })
                        : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    disabled={!canEdit}
                  />
                )}
              />
            )}

            <Controller
              name='footer_note'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={intl.formatMessage({ id: 'invoices.form.note' })}
                  multiline
                  rows={3}
                  error={!!errors.footer_note}
                  helperText={
                    errors.footer_note ? intl.formatMessage({ id: errors.footer_note.message }) : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  disabled={!canEdit}
                  sx={{
                    gridColumn: { md: 'span 2' },
                    '& .MuiInputBase-input': {
                      color: '#333333',
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Lignes de facture */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'invoices.form.lines' })}
          </Typography>

          <TableContainer
            component={Paper}
            variant='outlined'
            sx={{
              mb: 3,
              borderRadius: '8px',
              border: theme.palette.mode === 'dark' ? '1px solid #1b2431' : '1px solid #f5f5f5',
              boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'invoices.form.description' })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'invoices.form.unitPrice' })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'center',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'invoices.form.quantity' })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'invoices.form.total' })}
                  </TableCell>
                  {canEdit && (
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        textAlign: 'center',
                        borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell
                      sx={{ borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5' }}
                    >
                      <Controller
                        name={`invoice_lines.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            disabled={!canEdit}
                            error={!!errors.invoice_lines?.[index]?.description}
                            helperText={
                              errors.invoice_lines?.[index]?.description
                                ? intl.formatMessage({
                                    id: errors.invoice_lines[index]?.description?.message,
                                  })
                                : ''
                            }
                            sx={{
                              '& .MuiInputBase-input': {
                                color: '#333333',
                              },
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5' }}
                    >
                      <Controller
                        name={`invoice_lines.${index}.unit_price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            type='number'
                            inputProps={{ min: 0, step: 0.01 }}
                            disabled={!canEdit}
                            error={!!errors.invoice_lines?.[index]?.unit_price}
                            helperText={
                              errors.invoice_lines?.[index]?.unit_price
                                ? intl.formatMessage({
                                    id: errors.invoice_lines[index]?.unit_price?.message,
                                  })
                                : ''
                            }
                            sx={{
                              textAlign: 'right',
                              '& .MuiInputBase-input': {
                                color: '#333333',
                                textAlign: 'right',
                              },
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5' }}
                    >
                      <Controller
                        name={`invoice_lines.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            type='number'
                            inputProps={{ min: 1 }}
                            disabled={!canEdit}
                            error={!!errors.invoice_lines?.[index]?.quantity}
                            helperText={
                              errors.invoice_lines?.[index]?.quantity
                                ? intl.formatMessage({
                                    id: errors.invoice_lines[index]?.quantity?.message,
                                  })
                                : ''
                            }
                            sx={{
                              textAlign: 'center',
                              '& .MuiInputBase-input': {
                                color: '#333333',
                                textAlign: 'center',
                              },
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                        fontWeight: 600,
                        borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                      }}
                    >
                      {watchInvoiceLines?.[index] &&
                        formatPrice(
                          (watchInvoiceLines[index].unit_price || 0) *
                            (watchInvoiceLines[index].quantity || 0)
                        )}
                    </TableCell>
                    {canEdit && (
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                        }}
                      >
                        <Tooltip title={intl.formatMessage({ id: 'invoices.form.removeLine' })}>
                          <span>
                            <IconButton
                              onClick={() => removeInvoiceLine(index)}
                              disabled={fields.length === 1}
                              color='error'
                              size='small'
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={canEdit ? 3 : 2}
                    sx={{
                      textAlign: 'right',
                      fontWeight: 600,
                      borderBottom: 'none',
                    }}
                  >
                    Total:
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      borderBottom: 'none',
                    }}
                  >
                    {formatPrice(calculateTotal())}
                  </TableCell>
                  {canEdit && (
                    <TableCell
                      sx={{
                        borderBottom: 'none',
                      }}
                    />
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {canEdit && (
            <Box sx={{ mb: 3 }}>
              <PrimaryButton variant='outlined' startIcon={<AddIcon />} onClick={addInvoiceLine}>
                {intl.formatMessage({ id: 'invoices.form.addLine' })}
              </PrimaryButton>
            </Box>
          )}

          {/* Boutons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 4,
            }}
          >
            <BackButton />
            {canEdit && (
              <PrimaryButton type='submit' disabled={isSubmitting} sx={{ px: 4 }}>
                {isSubmitting ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  intl.formatMessage({ id: 'invoices.form.update' })
                )}
              </PrimaryButton>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Modal de confirmation pour le passage à l'état payé */}
      <ConfirmationModal
        open={showPaidConfirmation}
        title={intl.formatMessage({ id: 'invoices.confirmPaid.title' })}
        message={intl.formatMessage({ id: 'invoices.confirmPaid.message' })}
        onConfirm={handleConfirmPaidStatus}
        onCancel={handleCancelPaidStatus}
        confirmText={intl.formatMessage({ id: 'invoices.confirmPaid.confirm' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default EditInvoice;
