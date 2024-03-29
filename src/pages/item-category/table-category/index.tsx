import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem, TableListPagination, InputForm } from './data';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import { useIntl } from "umi";
import DeleteCategoryProxy from '@/services/proxy/item-categories/delete-item-category';
import CreateCategoryProxy from '@/services/proxy/item-categories/create-item-category';
import GetCategoryProxy from '@/services/proxy/item-categories/get-item-category';
import CategoryListProxy from '@/services/proxy/item-categories/get-item-categories';
import UpdateCategoryProxy from '@/services/proxy/item-categories/update-item-category';
import { CreatorInterface, ItemCategoryInterface } from '@/types/item-category';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { Modal } from 'antd';
import { CategoryInterface } from '@/types/item';

const CategoryTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<TableListPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [currentCategory, setCurrentCategory] = useState<ItemCategoryInterface>();
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const [countHanlde, setCountHandle] = useState<number>(0);

  const intl = useIntl();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: 'Name',
      hideInSearch: true,
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              GetCategory(entity.id);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      hideInSearch: true,
      title: 'Description',
      dataIndex: 'description',
      renderText: (description: string) => <p>{description}</p>,
    },
    {
      hideInSearch: true,
      title: 'Created by',
      dataIndex: 'createBy',
      renderText: (creator: CreatorInterface) => <p>{creator?.name}</p>,
    },
    {
      hideInSearch: true,
      title: 'Created At',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '2') {
          return <Input {...rest} placeholder="" />;
        }

        return defaultRender(item);
      },
    },
    {
      hideInSearch: true,
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setCurrentRow(record);
            GetCategory(record.id);
            setShowDetail(true);
          }}
        >
          Detail
        </a>,
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            (currentRow);
            handleUpdateModalVisible(true);
          }}
        >
          Update
        </a>,
        <a
          key="delete"
          onClick={() => {
            setCurrentRow(record);
            (currentRow);
            handleDeleteModalVisible(true);
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  const handleCreate = (values: InputForm) => {
    setIsLoading(true);
    CreateCategoryProxy({
      name: values.name,
      description: values.description,
    })
      .then((res) => {
        (res)
        if (res.status === ProxyStatusEnum.FAIL) {
          setIsLoading(false);
          message.error(res?.message?? 'create category fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setIsLoading(false);
          message.success("Success.");
          handleModalVisible(false);
          setCountHandle(countHanlde + 1);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        message.error(err.message ?? 'create category fail');
      })
      .finally(() => { });
  };

  const updateCategory = (id: number, values: InputForm) => {
    setIsLoading(true);
    UpdateCategoryProxy({
      id: id,
      name: values.name,
      description: values.description,
    })
      .then((res) => {
        (res)
        if (res.status === ProxyStatusEnum.FAIL) {
          setIsLoading(false);
          message.error(res.message ?? 'Update Category fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setIsLoading(false);
          message.success('Success!');
          setCountHandle(countHanlde + 1);
          handleUpdateModalVisible(false);
          GetCategory(id);
          return;
        }
      })
      .catch((err) => {
        setIsLoading(false);
        message.error(err.message ?? 'Update Category fail');
      })
      .finally(() => { });
  };

  const GetCategory = (id: number) => {
    GetCategoryProxy({
      id: id
    })
      .then((res) => {
        (res);
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error(res.message ?? 'get detail category fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setCurrentCategory(res?.data.itemCategory);
        }
      })
      .catch((err) => {
        message.error(err.message ?? 'get detail category fail');
      })
      .finally(() => { });
  };

  const deleteCategory = (id: number) => {
    DeleteCategoryProxy({
      id: id,
    })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error(res.message ?? 'delete category fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          message.success('Success!');
          setCountHandle(countHanlde + 1);
        }
      })
      .catch((err) => {
        message.error( err.message ?? 'delete category fail');
      })
      .finally(() => { });
  };


  useEffect(() => {
    setIsLoading(true);
    CategoryListProxy({ page: currentPage, limit: pageSize })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          setIsLoading(false);
          message.error(res.message ?? 'Load fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {

          let list: Array<TableListItem> = [];
          res?.data?.itemCategories && res?.data?.itemCategories.map((item) => {
            let tmp: TableListItem = {
              id: item.id,
              name: item.name,
              description: item.description,
              createBy: item.creator,
              createdAt: item.createdAt,
            }
            list.push(tmp);
          })
          setItemList(list);
          if (res?.data?.pagination) {
            setPagination({
              total: res?.data?.pagination?.totalCount ?? 0,
              pageSize: res?.data?.pagination?.count ?? pageSize,
              current: res?.data?.pagination?.page ?? 1,
            });
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        message.error( err ?? 'Load category fail');
      });
  }, [intl, countHanlde, currentPage, pageSize]);


  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        search={false}
        loading={isLoading}
        headerTitle="Category List "
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> Create
          </Button>,
        ]}
        dataSource={itemList}
        columns={columns}
        pagination={{
          pageSize: pageSize,
          total: pagination.total,
          current: pagination.current,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          onShowSizeChange: (page, pageSize) => {
            setPageSize(pageSize);
          },
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
      <Modal
        title="Delete Category"
        visible={deleteModalVisible}
        onOk={() => {
          handleDeleteModalVisible(false);
          if (currentRow) {
            deleteCategory(currentRow?.id)
          }
        }}
        onCancel={() => {
          handleDeleteModalVisible(false);
        }}
      >
        <p>Do you want to delete this office?</p>
      </Modal>
      <CreateForm
        modalVisible={createModalVisible}
        handleModalVisible={handleModalVisible}
        onSubmit={handleCreate}
      />
      {currentRow && <UpdateForm
        modalVisible={updateModalVisible}
        handleModalVisible={handleUpdateModalVisible}
        onSubmit={updateCategory}
        currentItem={currentRow}
      />}
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentCategory?.name && (
          <>
            <ProDescriptions<ItemCategoryInterface>
              column={1}
              title={currentCategory?.name}
              request={async () => ({
                data: currentCategory || {},
              })}
              params={{
                id: currentCategory?.id,
              }}
            />
            <p>Id: {currentCategory?.id}</p>
            <p>Name: {currentCategory?.name}</p>
            <p>Descriptions: {currentCategory?.description}</p>
            <p>Create By: {currentCategory.creator.name}</p>
            <p>Create at: {currentCategory?.createdAt}</p>
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CategoryTable;