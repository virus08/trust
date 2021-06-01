const express = require("express");
const request = require("request");
const csv = require("csvtojson");
const app = express();
app.use(express.static("public"));
async function redu(arr) {
  return await arr.reduce((acc, current) => {
    const x = acc.find((item) => item.Date === current.Date);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
}
async function xmap(ax, ay) {
  let ret = await ax.map((e) => {
    let obj = {
      date: e.Date,
    };
    let data = [];
    for (x = 0; x < 24; x++) {
      let xtime = x.toLocaleString("th-TH", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      let h = ay.find(
        (e) =>
          e.Type == "humidity" &&
          e.Time.slice(0, 2) + ":00:00" == xtime + ":00:00" &&
          e.Date == obj.date
      );
      let t = ay.find(
        (e) =>
          e.Type == "temperature" &&
          e.Time.slice(0, 2) + ":00:00" == xtime + ":00:00" &&
          e.Date == obj.date
      );
      let xdata = {};
      if (t) {
        xdata = {
          time: xtime + ":00:00",
          humidity: h.Value,
          temperature: t.Value,
        };
      } else
        xdata = {
          time: xtime + ":00:00",
          humidity: 0,
          temperature: 0,
        };

      data.push(xdata);
    }

    obj.data = data;
    return obj;
  });

  //console.log(ret);
  return ret;
}
async function getData() {
  let xcsv = await csv().fromStream(
    request.get("http://localhost:3000/001.csv")
  );
  let x001 = await redu(xcsv);
  let x002 = await xmap(x001, xcsv);
  return x002;
}

app.get("/data", async function (req, res) {
  let data = await getData();
  res.json(data);
});

app.listen(3000);
