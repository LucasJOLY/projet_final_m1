// EditQuote component will be implemented here
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
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { AppDispatch, RootState } from '../store';
import { fetchQuote, updateQuoteAction } from './store/slice';
import { fetchProjects } from '../projects/store/slice';
import type { QuoteFormData, QuoteStatus } from './types';
import type { Project } from '../projects/types';
import { QUOTE_STATUS_OPTIONS, formatPrice, calculateQuoteTotal, verifyQuoteNumber } from './utils';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import BackButton from '../components/BackButton';

const schema = yup.object().shape({
  project_id: yup.number().required('validation.required'),
  quote_number: yup.string().required('validation.required'),
  status: yup
    .number()
    .required('validation.required')
    .oneOf(QUOTE_STATUS_OPTIONS.map((option) => option.value))
    .transform((value) => Number(value)),
  issue_date: yup.string().required('validation.required'),
  expiry_date: yup.string().required('validation.required'),
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

const EditQuote: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userData = useSelector((state: RootState) => state.auth.authUser);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { currentQuote, loading } = useSelector((state: RootState) => state.quotes);

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<QuoteFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      project_id: 0,
      quote_number: '',
      status: 0 as QuoteStatus,
      issue_date: '',
      expiry_date: '',
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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'quote_lines',
  });

  const watchQuoteLines = watch('quote_lines');

  // Charger les projets et le devis au montage
  useEffect(() => {
    dispatch(fetchProjects({}));
    if (id) {
      dispatch(fetchQuote(parseInt(id)));
    }
  }, [dispatch, id]);

  // Pré-remplir le formulaire avec les données du devis existant
  useEffect(() => {
    if (currentQuote && !initialDataLoaded) {
      console.log('currentQuote', currentQuote);
      console.log('initialDataLoaded', initialDataLoaded);
      const formattedQuoteLines =
        currentQuote.quote_lines && currentQuote.quote_lines.length > 0
          ? currentQuote.quote_lines.map((line) => ({
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
        project_id: currentQuote.project_id,
        quote_number: currentQuote.quote_number,
        status: currentQuote.status,
        issue_date: currentQuote.issue_date.split('T')[0],
        expiry_date: currentQuote.expiry_date.split('T')[0],
        note: currentQuote.note || '',
        quote_lines: formattedQuoteLines,
      });

      // Remplacer les lignes du devis dans le formulaire
      replace(formattedQuoteLines);
      setInitialDataLoaded(true);
    }
  }, [currentQuote, reset, replace, initialDataLoaded]);

  const onSubmit = async (data: QuoteFormData) => {
    if (!id) return;

    try {
      if (!verifyQuoteNumber(data.quote_number)) {
        return;
      }
      await dispatch(updateQuoteAction({ id: parseInt(id), quoteData: data })).unwrap();
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

  const canEdit = currentQuote?.status !== 1; // 1 = accepté

  if (loading || !currentQuote) {
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
          {intl.formatMessage({ id: 'quotes.edit.title' })}
        </Typography>
      </Box>

      {/* Message d'information si devis accepté */}
      {!canEdit && (
        <Paper
          sx={{
            padding: '16px',
            mb: 3,
            backgroundColor: '#fff3cd',
            borderLeft: '4px solid #ffecb5',
          }}
        >
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {intl.formatMessage({ id: 'quotes.edit.acceptedWarning' })}
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
                    disabled={!canEdit}
                    displayEmpty
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
                  disabled={true}
                  label={intl.formatMessage({ id: 'quotes.form.number' })}
                  error={!!errors.quote_number}
                  helperText={
                    errors.quote_number
                      ? intl.formatMessage({ id: errors.quote_number.message })
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
                    {intl.formatMessage({ id: 'quotes.form.status' })}
                  </InputLabel>
                  <Select
                    {...field}
                    label={intl.formatMessage({ id: 'quotes.form.status' })}
                    disabled={!canEdit}
                  >
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
                  disabled={!canEdit}
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
            <Table>
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
                        name={`quote_lines.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant='outlined'
                            size='small'
                            disabled={!canEdit}
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
                      sx={{ borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5' }}
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
                            disabled={!canEdit}
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
                      sx={{ borderColor: theme.palette.mode === 'dark' ? '#1b2431' : '#f5f5f5' }}
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
                            disabled={!canEdit}
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
                    {canEdit && (
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
              <PrimaryButton variant='outlined' startIcon={<AddIcon />} onClick={addQuoteLine}>
                {intl.formatMessage({ id: 'quotes.form.addLine' })}
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
                  intl.formatMessage({ id: 'quotes.form.update' })
                )}
              </PrimaryButton>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditQuote;
