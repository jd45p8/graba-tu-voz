var express = require('express');
app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist'));

app.all("*", async (_req, res) => {
  try {
    res.sendFile(__dirname + '/dist/index.html');
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});