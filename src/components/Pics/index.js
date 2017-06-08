import React,{PropTypes} from 'react';
import {Modal,Table, Pagination, Popconfirm,Button,Row,Col,Icon,Menu,notification,Input} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva'; 

import DropMenu from '../DropMenu'
import ModalForm from './ModalForm';
const Search = Input.Search;

const List = ({dispatch,list:dataSource,loading,total,page:current,pageSize,selectedRowsIds}) => {

  const add=(values)=>{
    dispatch({
      type: 'pics/add',    
      payload: values,
    });
  }

  const remove=()=>{
    if(selectedRowsIds.length<1){
       notification.error({
          message: '请选择要删除的数据!',
       });
       return;
    }
    Modal.confirm({
      title: '您确删除选中的数据吗?',
      onOk() {
        del(selectedRowsIds);
      }
    });
  }
  const del=(ids)=>{
    dispatch({
      type: 'pics/remove',    
      payload: ids,
    });
  }

  const eidt=(id,values)=>{
    dispatch({
      type: 'pics/edit',    
      payload: {id,values},
    });
  }


  const pageChangeHandler=(page)=>{
    dispatch(routerRedux.push({
      pathname: '/pics',
      query: { page },
    }));
  }

  const showSizeChange=(page,pageSize)=>{
    dispatch(routerRedux.push({
      pathname: '/pics',
      query: { page,pageSize},
    }));
   
  }

  const handleMenuClick = (key, record) => {
    if(key=='del'){
       Modal.confirm({
        title: '您确定要删除这条记录吗?',
        onOk() {
          del([record.objId]);
        }
      });
    }
   
  }

  const doSearch=(val)=>{
    dispatch(routerRedux.push({
      pathname: '/pics',
      query: {keyword:val},
    }));
  }


  const rowSelection = {
    onChange:(selKeys)=>{
      selectedRowsIds=selKeys;
    }
  }

	const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },{
        title: '操作',
        key: 'operation',
        // width: 100,
        render: (text, record) => (
          <DropMenu>
            <Menu onClick={({key}) => handleMenuClick(key, record)}>
              <Menu.Item>
                <ModalForm record={record} MolalTitle={'编辑'} onOk={eidt.bind(null,record.objId)}>
                  编辑
                </ModalForm>
              </Menu.Item>
              <Menu.Item key={'del'}>删除</Menu.Item>
            </Menu>
          </DropMenu>
        ),
         textAlign: 'center'
      }
    ];

  return (
    <div>
      	<Row>
            <Col span={10}>
                <div className="db-table-button">
                      <ModalForm record={{}} MolalTitle={'添加'} onOk={add}>
                         <Button type="primary" >
                            <Icon type="plus-circle-o"/> 添加
                         </Button>  
                      </ModalForm>
                       <Button type="primary" onClick={remove}>
                          <Icon type="plus-circle-o"/> 删除 
                      </Button>               
                </div>
            </Col> 
            <Col span={14}>
                <Search
                        placeholder="输入名称查找"
                        style={{ width:300 }} 
                        onSearch={value =>{doSearch(value)}}
                      />
            </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.objId}
          pagination={false} />


        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={pageSize} 
          showQuickJumper={true}
          showTotal={()=>`共${total}条`}
          showSizeChanger={true}
          pageSizeOptions={['1','10']}
          onShowSizeChange={showSizeChange}
          onChange={pageChangeHandler}
          />


    </div>
  );






};




function mapStateToProps(state) {
  const {list,total,page,pageSize} = state.pics;
  return {
    loading: state.loading.models.pics,
    list,total,page,pageSize,selectedRowsIds:[]
  };
}


export default connect(mapStateToProps)(List);
