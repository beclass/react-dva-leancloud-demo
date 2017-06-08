import * as usersService from '../services/users';

export default {
  namespace: 'users',			//model 的 namespace
  state: {						// model 的初始化数据
  	list:[],
  	total:null,
  	page:null,
  },
  reducers: { //数据同步处理
  	// save 方法就是 reducer，可以看到它其实非常简单就是把老的 state 和接收到的数据处理下，返回新的 state
    save(state, { payload: { data: list, total, page } }) {

      	return { ...state, list, total, page };
    },
  },
  effects: {	//数据异步处理    被称为副作用   先触发effects 然后流向 reducers 最终改变 State。
  	 *fetch({ payload: { page =1} }, { call, put }) {
      const { data, headers } = yield call(usersService.fetch, { page });		// 用于调用异步逻辑，支持 promise 。
      yield put({ type: 'save', payload: { data, total: headers['x-total-count'] } }); // 用于触发 action 。这边需要注意的是，action 所调用的 reducer 或 effects 来源于本 model 那么在 type 中不需要声明命名空间，如果需要触发其他非本 model 的方法，则需要在 type 中声明命名空间，如 yield put({ type: 'namespace/fuc', payload: xxx });
      yield put({                                                          //call相当于调用执行一个函数，put相当于dispatch执行一个action     
      		type:'save',
      		payload:{
      			data,
      			total:parseInt(headers['x-total-count'],10),
      			page:parseInt(page,10)
      		}

      });
    },

    *remove({ payload: id }, { call, put, select }) {
      yield call(usersService.remove, id);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(usersService.patch, id, values);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    
    *create({ payload: values }, { call, put }) {
      yield call(usersService.create, values);
      yield put({ type: 'reload' });
    },

    *reload(action, { put, select }) {
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },

  },
  //初始化数据
  subscriptions: {		// 是一种从 源 获取数据的方法，它来自于 elm。语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。
  	setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },

  },



};
