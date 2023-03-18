//残課題：レコード修正した際、集計アプリへは再度購入データが飛んでしまう
//解決策：edit画面を開いた際に、修正前の購入データを集計アプリ上で削除してしまう
//　　　　⇒そのためには取引データを集計アプリ上で特定する必要があるため、ユニークなIDを割り振る必要がある？
(function(){
  'use srtict';
  console.log('動作テスト');
  kintone.events.on(['app.record.create.submit.success','app.record.edit.submit.success'], async(event) => {
    const client = new KintoneRestAPIClient();
    for(let key in event.record['テーブル'].value){
      let cond = `商品名 = "${event.record['テーブル'].value[key].value['商品名'].value}"`;
      let res = [];
      res = await client.record.getAllRecords({app: 12,condition:cond });
      let mod = {};
      mod = {
        '商品キールックアップ':{
        'value':event.record['テーブル'].value[key].value['商品キールックアップ'].value
        },
        'テーブル':{
        }
      };
      if(res[0] !== undefined){
        mod.テーブル = res[0].テーブル;
        mod.テーブル.value.push({
          'value':{
            '日付':{
              'value':event.record['取引日'].value
            },
            '購入数':{
              'value':event.record['テーブル'].value[key].value['購入数'].value
            },
            '購入金額':{
              'value':event.record['テーブル'].value[key].value['購入金額'].value
            }
          }        
        });
      }
      else{
        mod.テーブル.value = [];
        mod.テーブル.value[0] = ({
          'value':{
            '日付':{
              'value':event.record['取引日'].value
            },
            '購入数':{
              'value':event.record['テーブル'].value[key].value['購入数'].value
            },
            '購入金額':{
              'value':event.record['テーブル'].value[key].value['購入金額'].value
            }
          }        
        });
      }
      console.log(mod);
      let upsert = await client.record.upsertRecord({app: 12,updateKey:{'field':'商品名','value':event.record['テーブル'].value[key].value['商品名'].value},record:mod});
    }
      return event;
  });

})();
