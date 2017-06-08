import React from 'react';
import { connect } from 'dva';    // dva 的 connect 方法可以将组件和数据关联在一起
import { Table, Pagination, Popconfirm,Button} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import { PAGE_SIZE } from '../../constants';

import UserModal from './UserModal';



function Users({dispatch,list: dataSource,loading, total, page: current }) {

  function createHandler(values) {
    dispatch({
      type: 'users/create',     //调用一个action  type是 action的名称，与 reducers（effects）对应
      payload: values,        // 调用时传递的参数，在 reducers（effects）可以获取
    });
  }

  function deleteHandler(id) {
    console.warn(`TODO: ${id}`);
    dispatch({
      type: 'users/remove',
      payload: id,
    });

  }

  function editHandler(id, values) {
    dispatch({
      type: 'users/patch',
      payload: { id, values },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/users',
      query: { page },
    }));
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="">{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <UserModal record={record} title={'编辑'}  onOk={editHandler.bind(null, record.id)}>
            <a>Edit</a>
          </UserModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        
        <div className={styles.create}>
          <UserModal record={{}} title={'添加'} onOk={createHandler}>
            <Button type="primary">添加</Button>
          </UserModal>

        </div>



        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          pagination={false} />

        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={PAGE_SIZE} 
          onChange={pageChangeHandler}/>

      </div>
    </div>
  );



}

// 该方法名已经非常形象的说明了 connect 的作用在于 State -> Props 的转换，同时自动注册一个 dispatch 的方法，用以触发 action
//监听属性，建立组件和数据的映射关系
function mapStateToProps(state) {
  const { list, total, page } = state.users;
  return {
    loading: state.loading.models.users,
    list,
    total,
    page,
  };
}

              //关联model
export default connect(mapStateToProps)(Users);






