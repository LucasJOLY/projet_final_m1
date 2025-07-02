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
import { createQuoteAction } from './store/slice';
import { fetchProjects } from '../projects/store/slice';
import type { QuoteFormData, QuoteStatus, QuoteLineFormData } from './types';
import type { Project } from '../projects/types';
import { QUOTE_STATUS_OPTIONS, formatPrice, calculateQuoteTotal, verifyQuoteNumber } from './utils';
import { getNextQuoteNumber } from './service';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const schema = yup.object().shape({
  project_id: yup.number().required('validation.required'),
  quote_number: yup.string().required('validation.required'),
  status: yup
    .number()
    .required('validation.required')
    .oneOf(QUOTE_STATUS_OPTIONS.map((option) => option.value))
    .transform((value) => Number(value)),
  issue_date: yup.string().required('validation.required'),
  note: yup.string(),
  quote_lines: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required('validation.required'),
        unit_price: yup.number().required('validation.required').min(0.01, 'validation.priceMin'),
        quantity: yup.number().required('validation.required').min(1, 'validation.quantityMin'),
      })
    )
    .min(1, 'validation.linesRequired'),
}) as yup.ObjectSchema<QuoteFormData>;

const AddQuote: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client_id } = useParams<{ client_id: string }>();
  const userData = useSelector((state: RootState) => state.auth.authUser);
  const { projects } = useSelector((state: RootState) => state.projects);

  // Récupérer le project_id depuis les paramètres d'URL si présent
  const preselectedProjectId = searchParams.get('project_id');
  const [nextQuoteNumber, setNextQuoteNumber] = useState<string>('');
  const [loadingNumber, setLoadingNumber] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<QuoteFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      project_id: preselectedProjectId ? parseInt(preselectedProjectId) : 0,
      quote_number: '',
      status: 0 as QuoteStatus,
      issue_date: new Date().toISOString().split('T')[0],
      note: '',
      quote_lines: [
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
    name: 'quote_lines',
  });

  const watchQuoteLines = watch('quote_lines');

  // Charger les projets et le prochain numéro de devis au montage
  useEffect(() => {
    dispatch(fetchProjects({ client_id: client_id ? parseInt(client_id) : undefined }));
    loadNextQuoteNumber();
  }, [dispatch]);

  // Pré-sélectionner le projet si fourni dans l'URL
  useEffect(() => {
    if (preselectedProjectId) {
      setValue('project_id', parseInt(preselectedProjectId));
    }
  }, [preselectedProjectId, setValue]);

  // Charger le prochain numéro de devis
  const loadNextQuoteNumber = async () => {
    try {
      setLoadingNumber(true);
      const number = await getNextQuoteNumber();
      setNextQuoteNumber(number);
      setValue('quote_number', number);
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    } finally {
      setLoadingNumber(false);
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    try {
      if (!verifyQuoteNumber(data.quote_number)) {
        return;
      }
      await dispatch(createQuoteAction(data)).unwrap();
      navigate(-1);
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    }
  };

  const addQuoteLine = () => {
    append({
      description: '',
      unit_price: 0,
      quantity: 1,
    });
  };

  const removeQuoteLine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    return calculateQuoteTotal(watchQuoteLines || []);
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
        <SecondaryButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/quotes')}>
          {intl.formatMessage({ id: 'common.back' })}
        </SecondaryButton>
        <Typography
          component='h1'
          variant='h4'
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {intl.formatMessage({ id: 'quotes.add.title' })}
        </Typography>
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
            {intl.formatMessage({ id: 'quotes.form.basicInfo' })}
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
                    {intl.formatMessage({ id: 'quotes.form.project' })}
                  </InputLabel>
                  <Select
                    {...field}
                    label={intl.formatMessage({ id: 'quotes.form.project' })}
                    displayEmpty
                    sx={{
                      '& .MuiSelect-select': {
                        color: '#333333',
                      },
                    }}
                  >
                    <MenuItem value={0} disabled>
                      <em>{intl.formatMessage({ id: 'quotes.form.selectProject' })}</em>
                    </MenuItem>
                    {projects.map((project: Project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
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
              name='quote_number'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'quotes.form.number' })}
                  error={!!errors.quote_number}
                  helperText={
                    errors.quote_number
                      ? intl.formatMessage({ id: errors.quote_number.message })
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
                    {intl.formatMessage({ id: 'quotes.form.status' })}
                  </InputLabel>
                  <Select {...field} label={intl.formatMessage({ id: 'quotes.form.status' })}>
                    {QUOTE_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: option.backgroundColor,
                            }}
                          />
                          {intl.formatMessage({ id: option.label })}
                        </Box>
                      </MenuItem>
                    ))}
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
                  label={intl.formatMessage({ id: 'quotes.form.issueDate' })}
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
              name='note'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={intl.formatMessage({ id: 'quotes.form.note' })}
                  multiline
                  rows={3}
                  error={!!errors.note}
                  helperText={errors.note ? intl.formatMessage({ id: errors.note.message }) : ''}
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

          {/* Lignes du devis */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'quotes.form.lines' })}
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
                    {intl.formatMessage({ id: 'quotes.form.description' })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'quotes.form.unitPrice' })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'center',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'quotes.form.quantity' })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                      borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                    }}
                  >
                    {intl.formatMessage({ id: 'quotes.form.total' })}
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
                        name={`quote_lines.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            error={!!errors.quote_lines?.[index]?.description}
                            helperText={
                              errors.quote_lines?.[index]?.description
                                ? intl.formatMessage({
                                    id: errors.quote_lines[index]?.description?.message,
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
                        name={`quote_lines.${index}.unit_price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            type='number'
                            inputProps={{ min: 0, step: 0.01 }}
                            error={!!errors.quote_lines?.[index]?.unit_price}
                            helperText={
                              errors.quote_lines?.[index]?.unit_price
                                ? intl.formatMessage({
                                    id: errors.quote_lines[index]?.unit_price?.message,
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
                        name={`quote_lines.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            type='number'
                            inputProps={{ min: 1 }}
                            error={!!errors.quote_lines?.[index]?.quantity}
                            helperText={
                              errors.quote_lines?.[index]?.quantity
                                ? intl.formatMessage({
                                    id: errors.quote_lines[index]?.quantity?.message,
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
                      {watchQuoteLines?.[index] &&
                        formatPrice(
                          (watchQuoteLines[index].unit_price || 0) *
                            (watchQuoteLines[index].quantity || 0)
                        )}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5',
                      }}
                    >
                      <Tooltip title={intl.formatMessage({ id: 'quotes.form.removeLine' })}>
                        <span>
                          <IconButton
                            onClick={() => removeQuoteLine(index)}
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
            <PrimaryButton variant='outlined' startIcon={<AddIcon />} onClick={addQuoteLine}>
              {intl.formatMessage({ id: 'quotes.form.addLine' })}
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
            <SecondaryButton onClick={() => navigate('/quotes')} disabled={isSubmitting}>
              {intl.formatMessage({ id: 'quotes.form.cancel' })}
            </SecondaryButton>
            <PrimaryButton type='submit' disabled={isSubmitting} sx={{ px: 4 }}>
              {isSubmitting ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                intl.formatMessage({ id: 'quotes.form.save' })
              )}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddQuote;
