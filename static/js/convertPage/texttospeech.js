jQuery(function($) {

  // ajaxの前に実行される処理
  $.ajaxSetup({
    headers: { "X-CSRFToken": getCookie("csrftoken") }
});

  /**
   *　csvファイルアップロード処理
   *  // TODO ajaxの処理は共通化する
   * 
   */ 
  $('#uploadBtn').on('click', function(){
    var formData = new FormData();
    var csvfile = $('#csvtext')[0].files[0];
    formData.append('csvfile', csvfile);
    // Ajax通信を開始
    $.ajax({
      url: "texttospeech/upload",
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      enctype:  'multipart/form-data',
      timeout: 10000,
    }).done(function(data) {
        // 通信成功時の処理を記述
        $('#resultGET').text('POST処理成功');
        texttable(data);
    }).fail(function() {
        // 通信失敗時の処理を記述
        $('#resultGET').text('POST処理失敗.');
    });
    }
  );

  /**
   *　音声速度調整バーの設定
   *  
   */ 
  $('#textSpeed').on('change', function(){
    let speed = $('#textSpeed').val();
    console.log(speed);
    $('#currentSpeed').val(speed);
  });
});

/**
 * 取得データからテキストデータのテーブルを作成する処理
 * 
 */
function texttable(data)
{
  const data1 = data;
  const obj = JSON.parse(data1);
  console.log(obj.data);
  const colNames = ["", "id","テキスト"];
  //jqGridで表示する
  $("#sample1").jqGrid({
    data: obj.data,
    datatype: "local",
    colNames : colNames,  
    colModel:[
      { name: 'select' , index: 'select', width: 20, align: 'center', resizable: false, sortable: false,
                formatter: function (cellValue, option) {
                    return '<input type="radio" name="radio_' + option.gid + '" onclick=\"selectRow(this);\"/>';
                }
            },
      {index:'id', name:'id', width:'160', align:'center'},
      {index:'text', name:'text', width:'160', align:'center'},
     ],
    height:130,
  });

  // ダウンロードボタン作成
  form = "<form action='download' method='POST'>";
  form += "<input type='hidden' name='convertText'></input>";
  form += "<input type='hidden' name='csrfMiddleWareToken'></input>";
  form += "<input type='submit' value='ダウンロードする'></input>";
  form += "</form>"
  $("#textToSpeechBtn").append(form);
  $('input[name="csrfMiddleWareToken"]').val(getCookie("csrftoken"));
}

function selectRow(radio) {
  // クリックしたラジオボタンの行を選択状態にする
  var rowid = $(radio).closest('tr').attr('id');
  var cellData = $("#sample1").jqGrid("getRowData", rowid);
  $('input[name="convertText"]').val(cellData.text);
  var tbl = $("#sample1");
  tbl.jqGrid('setSelection', rowid);
}
