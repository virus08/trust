const csv = require("csvtojson");
const csvFilePath = "001.csv";

async function redu(arr) {
  return await arr.reduce((acc, current) => {
    const x = acc.find((item) => item.time === current.time);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
}
csv({
  output: "csv",
})
  .fromFile(csvFilePath)
  .then(async (csvRow) => {
    let xarray = await csvRow.map((e, k) => {
      let x = {
        date: e[0],
        time: e[1].slice(0, 2) + ":00:00",
      };
      if (e[2] == "temperature") {
        x.temperature = e[3];
      } else if (e[2] == "humidity") {
        x.humidity = e[3];
      }
      return x;
    });
    let humidity = xarray.filter(e => e.humidity)
    let temperature = xarray.filter(e => e.temperature)
    let xyz = await redu(humidity);
    let summary = xyz.map(e=>{
        const x = temperature.find((item) => item.time === e.time);
        e.temperature = x.temperature
        return e
    })
    console.log(summary.sort());
  });
