import { PlusOutlined } from '@ant-design/icons';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Input } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import type { TableUsersItem, TableUsersPagination } from './data';
import { users } from './service';

const TableUsers: React.FC = () => {
  //  Cửa sổ bật lên mới
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  //  Cửa sổ cập nhật phân phối bật lên

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableUsersItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableUsersItem[]>([]);
  // Cấu hình quốc tế hóa

  const columns: ProColumns<TableUsersItem>[] = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'email',
      dataIndex: 'email',
      sorter: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Đã kích hoạt',
          status: 'active',
        },
        1: {
          text: 'Chưa kích hoạt',
          status: 'inactive',
        },
        2: {
          text: 'Chặn',
          status: 'blocked',
        },
      },
    },
    {
      title: 'Thời gian giam gia',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '2') {
          return <Input {...rest} placeholder="Vui lòng nhập lý do chặn!" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: 'Loại đăng nhập',
      sorter: true,
      dataIndex: 'provider',
      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Tuỳ chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Xem chi tiết
        </a>,
        <a key="subscribeAlert">Block</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableUsersItem, TableUsersPagination>
        headerTitle="Mẫu yêu cầu"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> Mới
          </Button>,
        ]}
        request={users}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Đã chọn{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              Mục &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              console.log('Block user');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Xóa hàng loạt
          </Button>
          <Button type="primary">Phê duyệt hàng loạt</Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="Người dùng mới"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          console.log(value);
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Tên người dùng là bắt buộc',
            },
          ]}
          width="md"
          name="name"
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          console.log(value);
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableUsersItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableUsersItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableUsers;
