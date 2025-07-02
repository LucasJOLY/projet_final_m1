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
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { AppDispatch, RootState } from '../store';
import { createInvoiceAction } from './store/slice';
import { fetchProjects } from '../projects/store/slice';
import { fetchQuote } from '../quotes/store/slice';
import type { InvoiceFormData, InvoiceStatus } from './types';
import type { Project } from '../projects/types';
import {
  PAYMENT_TYPE_OPTIONS,
  formatPrice,
  calculateInvoiceTotal,
  checkInvoiceNumber,
} from './utils';
import { getNextInvoiceNumber } from './service';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const schema = yup.object().shape({
  project_id: yup.number().required('validation.required'),
  invoice_number: yup.string().required('validation.required'),
  status: yup
    .number()
    .required('validation.required')
    .oneOf([0, 1]) // 0=brouillon, 1=éditée pour création
    .transform((value) => Number(value)),
  issue_date: yup.string().required('validation.required'),
  payment_due_date: yup.string().required('validation.required'),
  payment_type: yup.string().required('validation.required'),
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

const AddInvoice: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client_id } = useParams<{ client_id: string }>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { currentQuote } = useSelector((state: RootState) => state.quotes);

  // Récupérer les paramètres depuis l'URL
  const preselectedProjectId = searchParams.get('project_id');
  const fromQuoteId = searchParams.get('from_quote');
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>('');
  const [loadingNumber, setLoadingNumber] = useState(true);
  const [quoteLoaded, setQuoteLoaded] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      project_id: preselectedProjectId ? parseInt(preselectedProjectId) : undefined,
      invoice_number: '',
      status: 0 as InvoiceStatus,
      issue_date: new Date().toISOString().split('T')[0],
      payment_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 jours par défaut
      payment_type: 'bank_transfer',
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoice_lines',
  });

  const watchInvoiceLines = watch('invoice_lines');

  // Charger les projets et le prochain numéro de facture au montage
  useEffect(() => {
    dispatch(fetchProjects({ client_id: client_id ? parseInt(client_id) : undefined }));
    loadNextInvoiceNumber();
  }, [dispatch, client_id]);

  // Charger le devis si conversion depuis un devis
  useEffect(() => {
    if (fromQuoteId && !quoteLoaded) {
      dispatch(fetchQuote(parseInt(fromQuoteId)));
      setQuoteLoaded(true);
    }
  }, [fromQuoteId, dispatch, quoteLoaded]);

  // Pré-sélectionner le projet si fourni dans l'URL
  useEffect(() => {
    if (preselectedProjectId) {
      setValue('project_id', parseInt(preselectedProjectId));
    }
  }, [preselectedProjectId, setValue]);

  // Pré-remplir le formulaire avec les données du devis
  useEffect(() => {
    if (currentQuote && fromQuoteId) {
      setValue('project_id', currentQuote.project_id);
      setValue('footer_note', currentQuote.note || '');

      // Convertir les lignes du devis en lignes de facture
      if (currentQuote.quote_lines && currentQuote.quote_lines.length > 0) {
        const invoiceLines = currentQuote.quote_lines.map((line) => ({
          description: line.description,
          unit_price: line.unit_price,
          quantity: line.quantity,
        }));

        // Utiliser setValue pour remplacer directement les lignes
        setValue('invoice_lines', invoiceLines);
      }
    }
  }, [currentQuote, fromQuoteId, setValue]);

  // Charger le prochain numéro de facture
  const loadNextInvoiceNumber = async () => {
    try {
      setLoadingNumber(true);
      const number = await getNextInvoiceNumber();
      setNextInvoiceNumber(number);
      setValue('invoice_number', number);
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    } finally {
      setLoadingNumber(false);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      console.log(data.invoice_number, nextInvoiceNumber);
      if (!checkInvoiceNumber(data.invoice_number, nextInvoiceNumber)) {
        return;
      }
      // si le numéro ne contient pas FAC- on l'ajoute
      if (!data.invoice_number.includes('FAC-')) {
        data.invoice_number = `FAC-${data.invoice_number}`;
      }
      const result = await dispatch(createInvoiceAction(data)).unwrap();
      navigate(`/invoices/${result.id}`);
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
        <SecondaryButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoices')}>
          {intl.formatMessage({ id: 'common.back' })}
        </SecondaryButton>
        <Box>
          <Typography
            component='h1'
            variant='h4'
            sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
          >
            {intl.formatMessage({ id: 'invoices.add.title' })}
          </Typography>
          {fromQuoteId && currentQuote && (
            <Typography variant='subtitle1' sx={{ color: theme.palette.text.secondary, mt: 1 }}>
              {intl.formatMessage(
                { id: 'invoices.add.fromQuote' },
                { quoteNumber: currentQuote.quote_number }
              )}
            </Typography>
          )}
        </Box>
      </Box>

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
                    displayEmpty
                    sx={{
                      '& .MuiSelect-select': {
                        color: '#333333',
                      },
                    }}
                  >
                    <MenuItem value={undefined} disabled>
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
                  label={intl.formatMessage({ id: 'invoices.form.number' })}
                  error={!!errors.invoice_number}
                  helperText={
                    errors.invoice_number
                      ? intl.formatMessage({ id: errors.invoice_number.message })
                      : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  disabled={loadingNumber}
                  InputProps={{
                    startAdornment: loadingNumber ? <CircularProgress size={20} /> : null,
                  }}
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
                  <Select {...field} label={intl.formatMessage({ id: 'invoices.form.status' })}>
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
            <Table sx={{ borderRadius: '8px' }}>
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
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'center',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell
                      sx={{
                        borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                      }}
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
                      sx={{
                        borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                      }}
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
                      sx={{
                        borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                      }}
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
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={3}
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
                  <TableCell
                    sx={{
                      borderBottom: 'none',
                    }}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mb: 3 }}>
            <PrimaryButton variant='outlined' startIcon={<AddIcon />} onClick={addInvoiceLine}>
              {intl.formatMessage({ id: 'invoices.form.addLine' })}
            </PrimaryButton>
          </Box>

          {/* Boutons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 4,
            }}
          >
            <SecondaryButton onClick={() => navigate('/invoices')} disabled={isSubmitting}>
              {intl.formatMessage({ id: 'invoices.form.cancel' })}
            </SecondaryButton>
            <PrimaryButton type='submit' disabled={isSubmitting} sx={{ px: 4 }}>
              {isSubmitting ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                intl.formatMessage({ id: 'invoices.form.save' })
              )}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddInvoice;
