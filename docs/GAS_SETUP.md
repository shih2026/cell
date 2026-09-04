# Google Apps Script (GAS) Backend Code

請將下列程式碼貼入您的 Google Apps Script 編輯器中，並發佈為「網頁應用程式」。

```javascript
// GAS 程式碼
var SHEET_NAME = "results";

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("questions");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({error: "Questions sheet not found"})).setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var questions = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var q = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j] === "options") {
        q[headers[j]] = JSON.parse(row[j]);
      } else {
        q[headers[j]] = row[j];
      }
    }
    questions.push(q);
  }
  
  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Class", "SeatNumber", "School", "Score", "Type"]);
  }
  
  var params = JSON.parse(e.postData.contents);
  var timestamp = new Date();
  
  sheet.appendRow([
    timestamp,
    params.classNo,
    params.seatNo,
    params.school,
    params.score,
    params.type || "Default"
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({result: "success", timestamp: timestamp}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 試算表結構建議
1. **questions 頁籤**：
   - `id`, `question`, `options` (格式: `["A", "B", "C", "D"]`), `answer` (文字), `explanation`
2. **results 頁籤**：自動產生

請記得在發佈時選擇「任何人」皆可執行。
