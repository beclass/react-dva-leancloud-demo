import React, { Component, PropTypes } from 'react'
import { Upload, Button, Icon, Modal, message } from 'antd'
import styles from './UploadFile.less'


import AV from 'leancloud-storage';

class UploadFiles extends React.Component {



  // componentDidMount() {
  //     let fileList=this.props.fileList;
  //     fileList=this.initFiles(fileList);
  //     this.setState({fileList})


  // }


  // componentWillReceiveProps(newProps) {
  //   let fileList=newProps.fileList;
  //   fileList=this.initFiles(fileList);
  //   this.setState({fileList})
  // }


  // initFiles=(fileList)=>{
  //     if(Array.isArray(fileList)) {
  //       return fileList.map((url, key) => {
  //         const urlArr = url.split('/')
  //         return { url: url, uid: key, name: urlArr[urlArr.length - 1], status: 'done' }
  //       })
  //     }
  //     if(fileList && !!fileList.length) {
  //       const filesArr = fileList.split('/')
  //       return [{ uid: -1, url: fileList, name: filesArr[filesArr.length - 1], status: 'done' }]
  //     }
  //     return '';
  // }

  static propTypes = {
    fileList: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    onUpload: PropTypes.func.isRequired,
    multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    disabled: PropTypes.bool,
    path: PropTypes.string
  }

  constructor(props) {
    super(props)

    const getFileList = (fileList) => {
      //alert(JSON.stringify(fileList)+"上传这样")
      if(Array.isArray(fileList)) {
        return fileList.map((url, key) => {
          const urlArr = url.split('/')
          return { url: url, uid: key, name: urlArr[urlArr.length - 1], status: 'done' }
        })
      }
      if(fileList && !!fileList.length) {
        const filesArr = fileList.split('/')
        return [{ uid: -1, url: fileList, name: filesArr[filesArr.length - 1], status: 'done' }]
      }
      return ''
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: getFileList(props.fileList)
    }
  }

  render() {

    const { previewVisible, previewImage, fileList } = this.state

    const { multiple = 1, onUpload, disabled, path } = this.props

    const renderFiles = (files, type) => {
      const fileList = files.map(file => {
        return type === 1 ? file.response.data.file : file
      })
      if(multiple === 1) {
        return fileList[0]
      }
      return fileList
    }


    const uploadProps = {
      disabled,
      listType: 'picture-card',
      fileList: fileList,
      multiple: multiple === true,
      onPreview: (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true
        })
      },
      customRequest:(fileList)=>{
        let file=fileList.file;
        let tempAvFile = new AV.File(file.name, file);
        tempAvFile.save().then(function(success) {              
              let fileItem=[{
                uid:file.uid,
                name: file.name,
                status: 'done',
                url: success.attributes.url,
              }]
              let flist=this.state.fileList;
              flist.push(fileItem)
              this.setState({fileList:fileItem});

              let urls=[success.attributes.url];
              this.props.onUpload(urls);
        }.bind(this), function(error) {
            // 异常处理
            console.error(error);
        });
      },

      beforeUpload: (file) => {

        return true
      },


      onChange: ({ file, fileList, e }) => {
        this.setState({ fileList: fileList })
        if(file.percent === 100 && file.status === "done") {
          onUpload(renderFiles(fileList, 1))
        }
      },
      onRemove: (file) => {
        if(disabled) {
          return false
        }
        const fileList = this.state.fileList.filter(item => item.uid !== file.uid)
        onUpload(renderFiles(fileList, 0))
      }


    }

    const modalProps = {
      visible: previewVisible,
      footer: null,
      onCancel: () => this.setState({ previewVisible: false })
    }

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">点击上传</div>
      </div>
    )

    return (
      <div className="clearfix">
        <Upload {...uploadProps}>
          {multiple === true ? uploadButton : (fileList.length >= multiple ? null : uploadButton)}
        </Upload>
        <Modal {...modalProps}>
          <img className={styles.previewImage} alt='' src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadFiles
