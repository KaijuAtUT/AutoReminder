function sendInterviewReminder() {
  const slackWebhookUrl = ""; // Slackに転送するためのwebhook URLを入れる
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1"); // シート名を設定する
  const now = new Date();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) { // 1行目はヘッダー
    const candidate = rows[i][0]; // A列: 受験者
    const interviewerA = rows[i][2]; // C列: 面接官AのSlackユーザーID
    const interviewerB = rows[i][4]; // E列: 面接官BのSlackユーザーID
    const interviewTime = new Date(rows[i][5]); // F列: 面接日時

    // 面接時間の30分前か確認
    const reminderTime = new Date(interviewTime.getTime() - 30 * 60 * 1000); // 30分前
    if (now >= reminderTime && now < interviewTime) {
      const message = `<!here> <@${interviewerA}> さん、 <@${interviewerB}> さん\n30分後に${candidate}さんの面接が開始されます！`;
      sendToSlack(slackWebhookUrl, message);
    }
  }
}

function sendToSlack(webhookUrl, message) {
  const payload = {
    text: message,
  };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(webhookUrl, options);
}
