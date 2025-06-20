import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp, Clock } from 'lucide-react';

const HBOTCalculator = () => {
  const [variables, setVariables] = useState({
    // Equipment & Setup
    chamberCost: 78846.45,
    installationCost: 0,
    facilitySetupCost: 0,
    trainingCost: 0,
    
    // Session Pricing
    averageSessionPrice: 150,
    
    // Package Pricing
    singleSessionPrice: 180,
    threeSessionPackageTotal: 500,
    twentySessionPackageTotal: 3000,
    fortySessionPackageTotal: 5500,
    
    // Utilization
    sessionsPerDay: 6,
    operatingDaysPerWeek: 5,
    utilizationRate: 70, // percentage
    rampUpMonths: 6,
    
    // Package Mix (percentages)
    singleSessionMix: 30,
    threeSessionMix: 20,
    twentySessionMix: 35,
    fortySessionMix: 15,
    
    // Operating Costs (monthly)
    staffCosts: 0,
    electricityCost: 0,
    oxygenCost: 0,
    maintenanceCost: 0,
    insuranceCost: 0,
    facilityCost: 0,
    marketingCost: 0,
    otherCosts: 0,
    
    // Financing
    downPayment: 45000,
    interestRate: 5,
    loanTermYears: 5
  });

  const [projectionPeriod, setProjectionPeriod] = useState(24); // months

  const calculations = useMemo(() => {
    const totalInitialInvestment = variables.chamberCost + variables.installationCost + 
                                 variables.facilitySetupCost + variables.trainingCost;
    
    // Financing calculations
    const loanAmount = totalInitialInvestment - variables.downPayment;
    const monthlyRate = variables.interestRate / 100 / 12;
    const totalPayments = variables.loanTermYears * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Session volume calculations
    const maxWeeklyCapacity = variables.sessionsPerDay * variables.operatingDaysPerWeek;
    const targetWeeklySessions = maxWeeklyCapacity * (variables.utilizationRate / 100);
    const targetMonthlySessions = targetWeeklySessions * 4.33; // average weeks per month

    // Package pricing breakdown
    const packagePrices = {
      single: variables.singleSessionPrice,
      three: variables.threeSessionPackageTotal / 3,
      twenty: variables.twentySessionPackageTotal / 20,
      forty: variables.fortySessionPackageTotal / 40
    };

    // Weighted average session price
    const weightedAveragePrice = 
      (packagePrices.single * variables.singleSessionMix / 100) +
      (packagePrices.three * variables.threeSessionMix / 100) +
      (packagePrices.twenty * variables.twentySessionMix / 100) +
      (packagePrices.forty * variables.fortySessionMix / 100);

    // Monthly projections
    const monthlyOperatingCosts = variables.staffCosts + variables.electricityCost + 
                                variables.oxygenCost + variables.maintenanceCost + 
                                variables.insuranceCost + variables.facilityCost + 
                                variables.marketingCost + variables.otherCosts;

    // Generate monthly projections
    const monthlyProjections = [];
    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;
    let cumulativeCashFlow = -variables.downPayment; // Initial investment

    for (let month = 1; month <= projectionPeriod; month++) {
      // Ramp-up factor
      const rampUpFactor = month <= variables.rampUpMonths ? 
        (month / variables.rampUpMonths) : 1;
      
      const monthlySessions = targetMonthlySessions * rampUpFactor;
      const monthlyRevenue = monthlySessions * weightedAveragePrice;
      const monthlyProfit = monthlyRevenue - monthlyOperatingCosts - monthlyPayment;
      
      cumulativeRevenue += monthlyRevenue;
      cumulativeProfit += monthlyProfit;
      cumulativeCashFlow += monthlyProfit;

      monthlyProjections.push({
        month,
        sessions: Math.round(monthlySessions),
        revenue: monthlyRevenue,
        operatingCosts: monthlyOperatingCosts,
        loanPayment: monthlyPayment,
        netProfit: monthlyProfit,
        cumulativeProfit,
        cumulativeCashFlow
      });
    }

    // Find break-even point
    const breakEvenMonth = monthlyProjections.find(m => m.cumulativeCashFlow > 0)?.month || null;

    // Key metrics
    const totalRevenue = cumulativeRevenue;
    const totalCosts = (monthlyOperatingCosts + monthlyPayment) * projectionPeriod;
    const roi = ((cumulativeProfit / totalInitialInvestment) * 100);
    const averageMonthlyProfit = cumulativeProfit / projectionPeriod;

    return {
      totalInitialInvestment,
      monthlyPayment,
      targetMonthlySessions,
      weightedAveragePrice,
      monthlyOperatingCosts,
      monthlyProjections,
      breakEvenMonth,
      totalRevenue,
      totalCosts,
      roi,
      averageMonthlyProfit,
      packagePrices
    };
  }, [variables, projectionPeriod]);

  const updateVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          HBOT Business Financial Calculator
        </h1>
        <p className="text-gray-600">
          Laydown 2.0 ATA Chamber - Interactive Financial Projections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Variables */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Projection Period */}
              <div>
                <label className="block text-sm font-medium mb-2">Projection Period (months)</label>
                <select 
                  value={projectionPeriod}
                  onChange={(e) => setProjectionPeriod(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                </select>
              </div>

              {/* Equipment & Setup */}
              <div>
                <h4 className="font-semibold mb-3">Equipment & Setup</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Chamber Cost</label>
                    <input
                      type="number"
                      value={variables.chamberCost}
                      onChange={(e) => updateVariable('chamberCost', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Installation Cost</label>
                    <input
                      type="number"
                      value={variables.installationCost}
                      onChange={(e) => updateVariable('installationCost', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Facility Setup Cost</label>
                    <input
                      type="number"
                      value={variables.facilitySetupCost}
                      onChange={(e) => updateVariable('facilitySetupCost', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Session Pricing */}
              <div>
                <h4 className="font-semibold mb-3">Package Pricing</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Single Session Price</label>
                    <input
                      type="number"
                      value={variables.singleSessionPrice}
                      onChange={(e) => updateVariable('singleSessionPrice', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">3-Session Package Total</label>
                    <input
                      type="number"
                      value={variables.threeSessionPackageTotal}
                      onChange={(e) => updateVariable('threeSessionPackageTotal', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">20-Session Package Total</label>
                    <input
                      type="number"
                      value={variables.twentySessionPackageTotal}
                      onChange={(e) => updateVariable('twentySessionPackageTotal', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">40-Session Package Total</label>
                    <input
                      type="number"
                      value={variables.fortySessionPackageTotal}
                      onChange={(e) => updateVariable('fortySessionPackageTotal', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Utilization */}
              <div>
                <h4 className="font-semibold mb-3">Utilization</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Sessions per Day</label>
                    <input
                      type="number"
                      value={variables.sessionsPerDay}
                      onChange={(e) => updateVariable('sessionsPerDay', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Operating Days per Week</label>
                    <input
                      type="number"
                      value={variables.operatingDaysPerWeek}
                      onChange={(e) => updateVariable('operatingDaysPerWeek', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Utilization Rate (%)</label>
                    <input
                      type="number"
                      value={variables.utilizationRate}
                      onChange={(e) => updateVariable('utilizationRate', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Ramp-up Period (months)</label>
                    <input
                      type="number"
                      value={variables.rampUpMonths}
                      onChange={(e) => updateVariable('rampUpMonths', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Package Mix */}
              <div>
                <h4 className="font-semibold mb-3">Package Mix (%)</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Single Sessions (%)</label>
                    <input
                      type="number"
                      value={variables.singleSessionMix}
                      onChange={(e) => updateVariable('singleSessionMix', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">3-Session Packages (%)</label>
                    <input
                      type="number"
                      value={variables.threeSessionMix}
                      onChange={(e) => updateVariable('threeSessionMix', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">20-Session Packages (%)</label>
                    <input
                      type="number"
                      value={variables.twentySessionMix}
                      onChange={(e) => updateVariable('twentySessionMix', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">40-Session Packages (%)</label>
                    <input
                      type="number"
                      value={variables.fortySessionMix}
                      onChange={(e) => updateVariable('fortySessionMix', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Operating Costs */}
              <div>
                <h4 className="font-semibold mb-3">Monthly Operating Costs</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Staff Costs</label>
                    <input
                      type="number"
                      value={variables.staffCosts}
                      onChange={(e) => updateVariable('staffCosts', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Electricity</label>
                    <input
                      type="number"
                      value={variables.electricityCost}
                      onChange={(e) => updateVariable('electricityCost', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Oxygen</label>
                    <input
                      type="number"
                      value={variables.oxygenCost}
                      onChange={(e) => updateVariable('oxygenCost', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Facility/Rent</label>
                    <input
                      type="number"
                      value={variables.facilityCost}
                      onChange={(e) => updateVariable('facilityCost', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Financing */}
              <div>
                <h4 className="font-semibold mb-3">Financing</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Down Payment</label>
                    <input
                      type="number"
                      value={variables.downPayment}
                      onChange={(e) => updateVariable('downPayment', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={variables.interestRate}
                      onChange={(e) => updateVariable('interestRate', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Loan Term (years)</label>
                    <input
                      type="number"
                      value={variables.loanTermYears}
                      onChange={(e) => updateVariable('loanTermYears', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Total Investment</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(calculations.totalInitialInvestment)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Monthly Payment</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(calculations.monthlyPayment)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Break-even</span>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {calculations.breakEvenMonth ? `${calculations.breakEvenMonth} months` : 'Not reached'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">ROI</span>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  {calculations.roi.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Package Pricing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Package Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="font-semibold">Single Session</div>
                  <div className="text-lg text-blue-600">{formatCurrency(calculations.packagePrices.single)}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="font-semibold">3-Session Package</div>
                  <div className="text-lg text-blue-600">{formatCurrency(calculations.packagePrices.three)}/session</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="font-semibold">20-Session Package</div>
                  <div className="text-lg text-blue-600">{formatCurrency(calculations.packagePrices.twenty)}/session</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="font-semibold">40-Session Package</div>
                  <div className="text-lg text-blue-600">{formatCurrency(calculations.packagePrices.forty)}/session</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="font-semibold">Weighted Average Price per Session</div>
                <div className="text-2xl text-green-600 font-bold">
                  {formatCurrency(calculations.weightedAveragePrice)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Projections Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Sessions</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Net Profit</th>
                      <th className="text-right p-2">Cumulative Cash Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.monthlyProjections.map((month) => (
                      <tr key={month.month} className="border-b hover:bg-gray-50">
                        <td className="p-2">{month.month}</td>
                        <td className="text-right p-2">{month.sessions}</td>
                        <td className="text-right p-2">{formatCurrency(month.revenue)}</td>
                        <td className={`text-right p-2 ${month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(month.netProfit)}
                        </td>
                        <td className={`text-right p-2 font-semibold ${month.cumulativeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(month.cumulativeCashFlow)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Target Monthly Sessions:</span>
                  <span className="font-semibold">{Math.round(calculations.targetMonthlySessions)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue ({projectionPeriod} months):</span>
                  <span className="font-semibold text-green-600">{formatCurrency(calculations.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Monthly Profit:</span>
                  <span className={`font-semibold ${calculations.averageMonthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculations.averageMonthlyProfit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Operating Costs:</span>
                  <span className="font-semibold">{formatCurrency(calculations.monthlyOperatingCosts)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HBOTCalculator;
