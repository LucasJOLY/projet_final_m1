import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchDashboardData, fetchQuarterData, fetchChartsData } from './store/slice';
import DashboardCard from './components/DashboardCard';
import {
  createClientCard,
  createProjectCard,
  createCurrentRevenueCard,
  createTargetRevenueCard,
  createRemainingRevenueCard,
  createPendingPaymentsCard,
  createDraftInvoicesCard,
  createQuarterCards,
} from './utils';
import { showDashboardError } from './service';
import { formatDateRange, formatCurrency } from './service';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();

  const { data, quarterData, chartsData, loading, quarterLoading, chartsLoading, error } =
    useSelector((state: RootState) => state.dashboard);

  const [selectedQuarter, setSelectedQuarter] = useState<'current' | 'previous' | 'next'>(
    'current'
  );

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Charger les données au montage du composant
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchQuarterData(selectedQuarter));
    dispatch(fetchChartsData({ year: selectedYear }));
  }, [dispatch]);

  // Recharger les données trimestrielles quand la sélection change
  useEffect(() => {
    dispatch(fetchQuarterData(selectedQuarter));
  }, [dispatch, selectedQuarter]);

  // Recharger les données des graphiques quand l'année change
  useEffect(() => {
    dispatch(fetchChartsData({ year: selectedYear }));
  }, [dispatch, selectedYear]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      showDashboardError(intl.formatMessage({ id: error }));
    }
  }, [error, intl]);

  // Gérer le changement de trimestre
  const handleQuarterChange = (event: SelectChangeEvent<string>) => {
    setSelectedQuarter(event.target.value as 'current' | 'previous' | 'next');
  };

  // Gérer le changement d'année
  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Afficher le loader lors du chargement initial
  if (loading && !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='h6' color='error'>
          {intl.formatMessage({ id: 'dashboard.error.noData' })}
        </Typography>
      </Box>
    );
  }

  // Créer les cartes de données
  const clientCard = createClientCard(
    data.clients,
    intl.formatMessage({ id: 'dashboard.cards.clients' })
  );

  const projectCard = createProjectCard(
    data.projects,
    intl.formatMessage({ id: 'dashboard.cards.projects' })
  );

  const currentRevenueCard = createCurrentRevenueCard(
    data.revenue,
    intl.formatMessage({ id: 'dashboard.cards.currentRevenue' })
  );

  const targetRevenueCard = createTargetRevenueCard(
    data.revenue,
    intl.formatMessage({ id: 'dashboard.cards.targetRevenue' })
  );

  const remainingRevenueCard = createRemainingRevenueCard(
    data.revenue,
    intl.formatMessage({ id: 'dashboard.cards.remainingRevenue' }),
    intl.formatMessage({ id: 'dashboard.cards.targetReached' })
  );

  const pendingPaymentsCard = createPendingPaymentsCard(
    data.pending_payments,
    intl.formatMessage({ id: 'dashboard.cards.pendingPayments' })
  );

  const draftInvoicesCard = createDraftInvoicesCard(
    data.draft_invoices,
    intl.formatMessage({ id: 'dashboard.cards.draftInvoices' })
  );

  // Créer les cartes trimestrielles
  const quarterCards = quarterData
    ? createQuarterCards(quarterData, {
        paidRevenue: intl.formatMessage({ id: 'dashboard.quarter.paidRevenue' }),
        estimatedRevenue: intl.formatMessage({ id: 'dashboard.quarter.estimatedRevenue' }),
        expensesToPay: intl.formatMessage({ id: 'dashboard.quarter.expensesToPay' }),
        estimatedExpenses: intl.formatMessage({ id: 'dashboard.quarter.estimatedExpenses' }),
      })
    : [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Titre principal */}
      <Typography
        variant='h4'
        component='h1'
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 4,
        }}
      >
        {intl.formatMessage({ id: 'dashboard.title' })}
      </Typography>

      {/* Première ligne - 2 cartes 1/4 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <DashboardCard data={clientCard} />
        <DashboardCard data={projectCard} />
      </Box>

      {/* Deuxième ligne - 3 cartes 1/3 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <DashboardCard data={currentRevenueCard} />
        <DashboardCard data={targetRevenueCard} />
        <DashboardCard data={remainingRevenueCard} />
      </Box>

      {/* Troisième ligne - 2 cartes 1/2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <DashboardCard data={pendingPaymentsCard} />
        <DashboardCard data={draftInvoicesCard} />
      </Box>

      {/* Section résumé trimestriel */}
      <Box sx={{ mb: 4 }}>
        {/* Titre et sélecteur de trimestre */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'flex-start', md: 'space-between' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 2, md: 0 },
            mb: 2,
          }}
        >
          <Typography
            variant='h5'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {intl.formatMessage({ id: 'dashboard.quarter.title' })}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper,
              padding: '15px 30px',
            }}
          >
            <Typography variant='body1' color='text.secondary'>
              {intl.formatMessage({ id: 'dashboard.quarter.select' })}
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={selectedQuarter}
                onChange={handleQuarterChange}
                label={intl.formatMessage({ id: 'dashboard.quarter.select' })}
              >
                <MenuItem value='previous'>
                  {intl.formatMessage({ id: 'dashboard.quarter.previous' })}
                </MenuItem>
                <MenuItem value='current'>
                  {intl.formatMessage({ id: 'dashboard.quarter.current' })}
                </MenuItem>
                <MenuItem value='next'>
                  {intl.formatMessage({ id: 'dashboard.quarter.next' })}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Période affichée */}
        {quarterData && (
          <Typography
            variant='body1'
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
            }}
          >
            {formatDateRange(quarterData.period.start, quarterData.period.end)}
          </Typography>
        )}

        {/* Cartes trimestrielles */}
        {quarterLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
            <CircularProgress />
          </Box>
        ) : quarterData ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            {quarterCards.map((card, index) => (
              <DashboardCard key={index} data={card} />
            ))}
          </Box>
        ) : (
          <Typography variant='body1' color='error'>
            {intl.formatMessage({ id: 'dashboard.quarter.error' })}
          </Typography>
        )}
      </Box>

      {/* Section Graphiques */}
      <Box sx={{ mb: 4 }}>
        {/* Titre et sélecteur d'année */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'flex-start', md: 'space-between' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 2, md: 0 },
            mb: 3,
          }}
        >
          <Typography
            variant='h5'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {intl.formatMessage({ id: 'dashboard.charts.monthlyRevenue' })}
          </Typography>

          {/* Sélecteur d'année - seulement si plusieurs années disponibles */}
          {chartsData && chartsData.available_years.length > 1 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: '8px',
                backgroundColor: theme.palette.background.paper,
                padding: '15px 30px',
              }}
            >
              <Typography variant='body1' color='text.secondary'>
                {intl.formatMessage({ id: 'dashboard.charts.selectYear' })}
              </Typography>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={selectedYear.toString()}
                  onChange={handleYearChange}
                  label={intl.formatMessage({ id: 'dashboard.charts.selectYear' })}
                >
                  {chartsData.available_years.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Graphique en barres - CA mensuels */}
        {chartsLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
            <CircularProgress />
          </Box>
        ) : chartsData ? (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: chartsData.monthly_revenue.map((item) => item.month_short),
                  tickPlacement: 'middle',
                  tickLabelPlacement: 'middle',
                },
              ]}
              series={[
                {
                  data: chartsData.monthly_revenue.map((item) => item.revenue),
                  label: intl.formatMessage({ id: 'dashboard.charts.monthlyRevenue' }),
                  valueFormatter: (value) => formatCurrency(value || 0),
                },
              ]}
              width={1200}
              height={400}
              margin={{ left: 100, right: 50, top: 50, bottom: 50 }}
            />
          </Paper>
        ) : (
          <Typography variant='body1' color='error'>
            {intl.formatMessage({ id: 'dashboard.charts.error' })}
          </Typography>
        )}

        {/* Titre pour le graphique cumulatif */}
        <Typography
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          {intl.formatMessage({ id: 'dashboard.charts.cumulativeRevenue' })}
        </Typography>

        {/* Graphique en ligne - CA cumulatif */}
        {chartsLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
            <CircularProgress />
          </Box>
        ) : chartsData ? (
          <Paper
            sx={{
              p: 3,
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <LineChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: chartsData.cumulative_revenue.map((item) => item.month_short),
                  tickPlacement: 'middle',
                  tickLabelPlacement: 'middle',
                },
              ]}
              series={[
                {
                  data: chartsData.cumulative_revenue.map((item) => item.cumulative_revenue),
                  label: intl.formatMessage({ id: 'dashboard.charts.cumulativeRevenue' }),
                  valueFormatter: (value) => formatCurrency(value || 0),
                  curve: 'monotoneX',
                },
              ]}
              width={1200}
              height={400}
              margin={{ left: 100, right: 50, top: 50, bottom: 50 }}
            />
          </Paper>
        ) : (
          <Typography variant='body1' color='error'>
            {intl.formatMessage({ id: 'dashboard.charts.error' })}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
