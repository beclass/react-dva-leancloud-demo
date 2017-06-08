import {DB} from '../utils/lean';
const dbName='Content_pic';

export async function fetch({params}) {

  const keyword=params.pathQuery.keyword?params.pathQuery.keyword:'';
  const currentPage=params.page;
  const pageSize=params.pageSize;

	let query=new DB.Query(dbName);
  query.ascending('sort');
  query.limit(pageSize);// 最多返回 10 条结果
  query.skip((currentPage -1)*pageSize);// 跳过 几条 条结果

  if(keyword!==''){
    query.contains('name', keyword);
  }

  let count=await query.count();
  let results=await query.find();

  let tempList=[];
  for (let i in results) {
        let tempObj = {
          rowkey:'',
          objId:'',
          name:'',
          picUrl : '',
          url:'',
          type:'',
          sort:'',
          title : '',
          link:''
        }

        tempObj.rowkey=i;
        tempObj.objId=results[i].id;
        tempObj.name = results[i].attributes.name;
        tempObj.picUrl = results[i].attributes.picUrl;
        tempObj.url = results[i].attributes.picUrl;
        tempObj.type=results[i].attributes.type;
        tempObj.sort=Number(results[i].attributes.sort);
        tempObj.title=results[i].attributes.title;
        tempObj.link=results[i].attributes.link;

        tempList.push(tempObj); 

  };

  let ret={
    data:tempList,
    total:count
  }
  return ret;

}

export async function remove(ids) {

  // let dataInfo = DB.Object.createWithoutData(dbName, ids[0]);
  // try{
  //   await dataInfo.destroy();
  //   return {code:0,msg:'删除成功'};
  // }catch(e){
  //   return {code:99,msg:e.toString()};
  // }
  let [count,okNum,errNum,error]=[0,0,0,''];
  for(let id of ids){
    let dataInfo = DB.Object.createWithoutData(dbName,id);
    try{
      await dataInfo.destroy();
      okNum++;        
    }catch(e){
      error=e;
      errNum++;
    }
    count++;
    if(count==ids.length){
      if(okNum==0){
        return {code:99,msg:error.toString()};
      }else{
        return {code:0,msg:`${okNum}条成功，${errNum}条失败`};
      }
    }
  }  
}


export async function update(id, values) {
  let {entries}= Object;
  let obj = values;
  let tbInfo = DB.Object.createWithoutData(dbName,id);
  for (let [key, value] of entries(obj)) {
    tbInfo.set(key,value);
  }
  try{
    await tbInfo.save();
    return {code:0,msg:'修改成功'};
  }catch(e){
    return {e,code:99,msg:e.toString()};
  }
}

export async function add(values) {
  const tbClass=DB.Object.extend(dbName);
  const tbInfo=new tbClass();
  tbInfo.set('name',values.name);
  tbInfo.set('sort',Number(values.sort));
  tbInfo.set('title',values.title);
  try{
    await tbInfo.save();
    return {code:0,msg:'添加成功'};
  }catch(e){
    return {e,code:99,msg:e.toString()};
  }
  
}







