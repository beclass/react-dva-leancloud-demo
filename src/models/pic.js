import {notification} from 'antd';
import * as Service from '../services/pic';
export default {

  namespace: 'pics',

  state: {
    list:[],
    total:null,
    page:1,
    pageSize:null
  },


  //初始化数据
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/pics') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },

  //数据异步处理对象
  effects: {
     *fetch({ payload:{page=1,pageSize=3}}, {select, call, put }) {  // eslint-disable-line

      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)

      const params={page:page,pageSize:pageSize,pathQuery};
      const { data,total} = yield call(Service.fetch, {params});  
      yield put({  
          type:'save',
          payload:{
            data,total,
            page:parseInt(page,10),
            pageSize:parseInt(pageSize,10),
            
          }

      });
    
    },

    *add({ payload: values }, { call, put }) {
      const {code,msg}=yield call(Service.add, values);
      if(code==0){
          notification.success({message: '添加成功'});
      }else{
          notification.error({message: '添加失败',description:msg});
      }
      yield put({ type: 'reload' });
    },

    *remove({payload:ids},{call,put}){
      const {code,msg}=yield call(Service.remove, ids);
      if(code==0){
          notification.success({message: '删除成功',description:msg});
      }else{
          notification.error({message: '删除失败',description:msg});
      }
      yield put({ type: 'reload' });
    },

    *edit({payload:{id,values}},{call,put}){
      const {code,msg}=yield call(Service.update,id,values);
      if(code==0){
          notification.success({message: '修改成功'});
      }else{
          notification.error({message: '修改失败',description:msg});
      }
      yield put({ type: 'reload' });
    },

    *reload(action, { put, select }) {
      const page = yield select(state => state.pics.page);
      yield put({ type: 'fetch', payload: {page} });
    },

    *showModal ({ payload }, { call, put }) {
      const { type, curItem } = payload
      let newData = curItem;
      yield put({ type: 'modal/setItem', payload: newData })
    },


  },

  reducers: {
    save(state, { payload: { data: list,total,page,pageSize} }) {
        return { ...state, list,total,page,pageSize};
    },
    stateChanged(state, action) {
      return { ...state, ...action.payload }
    }


  },

};
