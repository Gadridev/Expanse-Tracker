export default function ConvertToMonth(model:any[]){
    const formattedMonthlyReport = model.reduce((acc, item) => {
        const monthName = new Date(
          item._id.year,
          item._id.month - 1
        ).toLocaleString("default", { month: "short" });
        //CHECHKING IF THE MONTH EXISTS
        const existingMonth = acc.find((m: any) => m.name === monthName);
        console.log("red",item,acc,existingMonth)
        if (existingMonth) {
          if (item._id.categoryType) {
            existingMonth[item._id.categoryType.toLowerCase()] = item.totalAmount;
          }
        } else {
          acc.push({
            name: monthName,
            [item._id.categoryType
              ? item._id.categoryType.toLowerCase()
              : "undefined"]: item.totalAmount,
          });
        }

        return acc;
      }, []);
      return formattedMonthlyReport;
}