import React, { useState, useCallback, useRef } from 'react';
import { Upload, Button, Tooltip, message } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const type = 'DragableUploadList';

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
    console.log('originNode',originNode)
  const ref = React.useRef();
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const errorNode = <Tooltip title='Upload Error'>{originNode.props.children}</Tooltip>;
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move' }}
    >
      {file.status === 'error' ? errorNode : originNode}
    </div>
  );
};

const DragSortingUpload = (props) => {
    console.log('fileList',props.fileList)
  const [fileList, setFileList] = useState(props.images);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList[dragIndex];
      console.log('dragRow',dragRow)
      setFileList(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [fileList],
  );
  
  const onChange = ({ fileList: newFileList }) => {
      console.log('newFileList',newFileList)
      setFileList(newFileList);
      props.callNext(newFileList)
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isJpgOrPng) {
    //     message.error('You can only upload JPG , JPEG  & PNG file!');
    //     return false;
    // } else if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!');
    //     return false;
    // } else {
    //     setFileList(newFileList);
    //   }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className='ant-upload-text'>Upload</div>
      <img
        src={require('../../../../../assets/images/icons/upload-small.svg')}
        alt='upload'
      />
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
    <ImgCrop>
      <Upload
        // name='avatar'
        listType='picture-card'
        className='avatar-uploader post-ad-upload-pics'
        showUploadList={true}
        fileList={fileList}
        customRequest={dummyRequest}
        onChange={onChange}
        multiple={true}
        itemRender={(originNode, file, currFileList) => (
          <DragableUploadListItem
            originNode={originNode}
            file={file}
            fileList={currFileList}
            moveRow={moveRow}
          />
        )}
      >
          {/* {fileList && fileList.length >= 8 ? null : uploadButton} */}
          {uploadButton}
      </Upload>
      </ImgCrop>
    </DndProvider>
  );
};


export default DragSortingUpload
