(function(){
    'use srtict';
    window.a = window.a || {};
    window.a.getRecords = function (appId, query, orderBy, opt_limit, opt_offset, opt_records) {
        query = query || ``;
        orderBy = orderBy || `order by $id asc`;
        let offset = opt_offset || 0;
        let limit = opt_limit || 500;
        let allRecords = opt_records || [];
        let id_query = $id >  + offset;
        id_query = (query) ?  and  + id_query : id_query;
        let s_query = query + id_query + `  + orderBy +  limit ` + limit;

        let body = {
            'app': appId,
            'query': s_query
        };
        return kintone.api(kintone.api.url(`/k/v1/records`, true), `GET`, body).then(function (resp) {
            allRecords = allRecords.concat(resp.records);
            if (resp.records.length === limit) {
                if (typeof opt_limit !== `number`) {
                    offset = Number(resp.records[resp.records.length - 1].$id.value);
                    return window.tin_functions.getRecords(appId, query, orderBy, opt_limit, offset, allRecords);
                };
            };
            return allRecords;
        }, function (err) {
            console.log(err);
            return;
        });
    };

    //eventの定義
    //deleteは、
    //app.record.index.delete.submit
    //app.record.detail.delete.submit
    const KINTONE_EVENT = ['app.record.detail.show',];

    //アプリIDの定義
    //const APP_ID = {'商品マスタ':9, '購入履歴':10, '集計':12};

    //メイン処理
    kintone.events.on(KINTONE_EVENT, function(event) {
        const myBtn = document.createElement(`input`);
        myBtn.type = `button`;
        myBtn.value = `経歴書ダウンロード`;           
        myBtn.id = 'myButtonId';
        const myBtnSpace = kintone.app.record.getSpaceElement('space');
        myBtnSpace.appendChild(myBtn);
        myBtn.addEventListener('click', function(event) {
            const dom = kintone.app.record.getFieldElement("添付ファイル");
            try{
                location.replace(dom.children[0].children[0].children[0].href);
            }
            catch(e){
                alert('添付ファイルがありません！');
            };
        });
        return event;
    });

    kintone.events.on([`app.record.index.show`], function(event) {
        let a = "test";
        let b = "test";
        let c = (a === b);
        console.log(c); 
        Swal.fire({
            type:"warning",
            title: '注意',
            html: `<a href="https://www.yahoo.co.jp/">yahoo!</a><BR><a href="https://www.goole.com/">Google</a>`,
          });
        return event;
    });


})();