import {CommonNumbers} from '@constants/numbers';
import {CommonStrings, DateFormats} from '@constants/strings';
import {
  getMemberCumulativeArrearsFromReport,
  getSocietyCostFromReport,
  getSocietyCumulativeAssetFromReport,
  getSocietyCumulativeMoneyInHandFromReport,
  getSocietyCumulativeReceivablesFromReport,
  getSocietyIncomeFromReport,
} from '@utils';
import moment from 'moment';

export const getSocietyMembersReportsHtml = (
  societyInfo,
  membersReports,
  societyReports,
) => {
  const reports = Array(societyReports?.length).fill(Math.random());
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        table {
          height: 100dvh;
          width: 100%;
          border-collapse: collapse;
        }
        td {
          text-align: center;
        }
        tr:nth-child(even) {
          background-color: lightgray;
        }
        .bottom {
          text-align: right;
        }
        .bottom .amount {
          text-align: center;
        }
      </style>
    </head>
    <body>
        ${reports
          ?.map((_, index) => {
            const currentMonthSocietyReport = societyReports?.[index];
            const previousMonthSocietyReport =
              currentMonthSocietyReport?.prevReport;
            const currentMonthIncome = getSocietyIncomeFromReport(
              currentMonthSocietyReport,
            );
            const currentMonthExpense = getSocietyCostFromReport(
              currentMonthSocietyReport,
            );
            const currentMonthCumulativeMoneyInHand =
              getSocietyCumulativeMoneyInHandFromReport(
                currentMonthSocietyReport,
              );
            const previousMonthCumulativeMoneyInHand =
              previousMonthSocietyReport
                ? getSocietyCumulativeMoneyInHandFromReport(
                    previousMonthSocietyReport,
                  )
                : 0;
            // We could use getSocietyMoneyInHandFromReport but we need both currentMonthCumulativeMoneyInHand and previousMonthCumulativeMoneyInHand to show data
            const currentMonthMoneyInHand =
              currentMonthCumulativeMoneyInHand -
              previousMonthCumulativeMoneyInHand;
            const currentMonthCumulativeReceivables =
              getSocietyCumulativeReceivablesFromReport(
                currentMonthSocietyReport,
              );
            const currentMonthCumulativeAsset =
              getSocietyCumulativeAssetFromReport(currentMonthSocietyReport);
            return `<table>
            <tr>
              <th colspan="6;">
                <div style="text-align: center;">
                  <h1>${societyInfo?.name} MONTHLY REPORT</h1>
                  <h1>MONTH: ${moment(
                    membersReports?.[CommonNumbers.zero]?.reports?.[index]
                      ?.date,
                  ).format(DateFormats.yearMonth)}</h1>
                </div>
              </th>
            </tr>
            <tr>
              <th>NAME</th>
              <th>ARREARS</th>
              <th>RECEIVABLES</th>
              <th>TOTAL</th>
              <th>INCOME</th>
              <th>BALANCE</th>
            </tr>
            ${membersReports
              ?.map(mr => {
                const report = mr?.reports?.[index];
                const pReport = report?.prevReport;
                if (!report && !pReport) {
                  // Which means blocked member info missing some date report
                  return CommonStrings.empty;
                }
                const previousMonthArrears =
                  pReport?.receivablesTotal - pReport?.amountHistoryTotal;
                const receivables =
                  report?.receivablesTotal - pReport?.receivablesTotal;
                const arrearsBeforeMeeting = previousMonthArrears + receivables;
                const income =
                  report?.amountHistoryTotal - pReport?.amountHistoryTotal;
                const currentMonthArrears =
                  getMemberCumulativeArrearsFromReport(report);

                return `<tr>
                  <td>${mr?.member?.name}</td>
                  <td>${
                    pReport ? previousMonthArrears : CommonStrings.empty
                  }</td>
                  <td>${pReport ? receivables : CommonStrings.empty}</td>
                  <td>${
                    pReport ? arrearsBeforeMeeting : CommonStrings.empty
                  }</td>
                  <td>${pReport ? income : CommonStrings.empty}</td>
                  <td>${
                    pReport ? currentMonthArrears : CommonStrings.empty
                  }</td>
                </tr>`;
              })
              .join(CommonStrings.empty)}
            <tr class="bottom" style="border-top: solid;">
              <th colspan="4;">THIS MONTH INCOME</th>
              <th class="amount" colspan="2;">${currentMonthIncome}</th>
            </tr>
            <tr class="bottom">
              <th colspan="4;">THIS MONTH EXPENSES</th>
              <th class="amount" colspan="2;">${currentMonthExpense}</th>
            </tr>
            <tr class="bottom">
              <th colspan="4;">THIS MONTH HAND BALANCE</th>
              <th class="amount" colspan="2;">${currentMonthMoneyInHand}</th>
            </tr>
            <tr class="bottom">
              <th colspan="4;">LAST MONTH HAND BALANCE</th>
              <th class="amount" colspan="2;">${previousMonthCumulativeMoneyInHand}</th>
            </tr>
            <tr class="bottom">
              <th colspan="4;">TOTAL HAND BALANCE</th>
              <th class="amount" colspan="2;">${currentMonthCumulativeMoneyInHand}</th>
            </tr>
            <tr class="bottom">
              <th colspan="4;">THIS MONTH RECEIVABLES</th>
              <th class="amount" colspan="2;">${currentMonthCumulativeReceivables}</th>
            </tr>
            <tr class="bottom">
              <th colspan="4;">TOTAL SOCIETY ASSET</th>
              <th class="amount" colspan="2;">${currentMonthCumulativeAsset}</th>
            </tr>
          </table>
          `;
          })
          .join(CommonStrings.empty)}
    </body>
  </html>
  `;
};
