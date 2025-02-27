import React from 'react'
import { Avatar, Button, CopyButton, LoadingOverlay, Menu, Modal, Table, Textarea, TextInput } from '@mantine/core'
import { pb } from 'shared/api';
import { HiDotsVertical } from 'react-icons/hi';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import { openConfirmModal } from '@mantine/modals';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from 'useAuth';

async function getUsers () {
  return await pb.collection('users').getFullList({
    expand: 'user'
  })
}

export const Users = () => {

  const navigate = useNavigate()

  const {user, logout, loading} = useAuth()

  const [users, setUsers] = React.useState([]);
  const [load, loading_h] = useDisclosure(false)

  const [passwordModal, passwordModal_h] = useDisclosure(false)
  const [password, setPassword] = React.useState('')

  const [notificationModal, notificationModal_h] = useDisclosure(false)
  const [sendLoading, sendLoading_h] = useDisclosure(false)
  const [receiver, setReceiver] = React.useState({})
  const [message, setMessage] = React.useState('')
  const [notificationError, setNotificationError] = React.useState('')

  async function sendNotification () {
    sendLoading_h.open()
    try {
      return await pb.collection('notifications').update(receiver?.id, {
        status: 'sent',
        message 
      })
      .then(() => {
        showNotification({
          title: 'Уведомление',
          message: 'Уведомление успешно отправлено',
          color: 'green'
        })
        setMessage('')
      })
      .finally(() => {
        sendLoading_h.close()
        notificationModal_h.close()
      })
    } catch (err) {
      sendLoading_h.close()
      setNotificationError('Не удалось отправить уведомление')
      throw err
    }
  }
  
  async function handleUsers () {
    loading_h.open()
    const users = await getUsers()
    setUsers(users)
    loading_h.close()
  }
  
  const [create, create_h] = useDisclosure(false)
  const [edit, edit_h] = useDisclosure(false)

  const [createData, setCreateData] = React.useState({
    name: '',
    phone: '',
    email: '',
    iin: ''
  })

  const [editData, setEditData] = React.useState({})

  function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  async function createUser () {
    
    if (!createData.name || !createData.phone || !createData.email || !createData.iin) {
      showNotification({
        title: 'Создание пользователя',
        message: 'Все поля должны быть заполнены',
        color: 'red'
      });
      return;
    }

    loading_h.open()
    const password = generateRandomPassword(8)

    await pb.collection('users').create({
      ...createData,
      password: password,
      passwordConfirm: password, 
      emailVisibility: true,
    })
    .then(async res => {

      await pb.collection('notifications').create({
        id: res?.id,
        user: res.id,
      })

      await pb.collection('locations').create({
        id: res?.id,
        user: res.id,
      })
      .then(res => {
        setPassword(password)
        passwordModal_h.open()
      })
      
      showNotification({
        title: 'Создание пользователя',
        message: `Пользователь ${createData.name} успешно создан`,
        color: 'green'
      })
      await handleUsers()
      create_h.close()
      console.log(res, 'res');
    })
    .catch(err => {
      console.log(err, 'err');
    })

    loading_h.close()
  }

  async function editUser () {

    if (!editData.name || !editData.phone || !editData.email || !editData.iin) {
      showNotification({
        title: 'Редактирование пользователя',
        message: 'Все поля должны быть заполнены',
        color: 'red'
      });
      return;
    }

    loading_h.open()

    await pb.collection('users').update(editData.id, {
      ...editData,
    })
    .then(async res => {
      showNotification({
        title: 'Редактирование пользователя',
        message: `Пользователь ${createData.name} успешно отредактирован`,
        color: 'green'
      })
      await handleUsers()
      console.log(res, 'res');
    })
    .catch(err => {
      console.log(err, 'err');
    })

    loading_h.close()
  }

  async function deleteUser (u) {
    openConfirmModal({
      title: 'Удаление пользователя',
      children: `Вы уверены, что хотите удалить пользователя ${u.name}?`,
      centered: true,
      labels: {cancel: 'Отмена', confirm: 'Удалить'},
      onConfirm: async () => {
        loading_h.open()

        
        await pb.collection('users').delete(u.id)
        .then(async res => {
          await pb.collection('notifications').delete(u?.id)
          await pb.collection('locations').delete(u.id)
          showNotification({
            title: 'Удаление пользователя',
            message: `Пользователь ${u.name} успешно удален`,
            color: 'green'
          })
          await handleUsers()
          console.log(res, 'res');
        })
        .catch(err => {
          console.log(err, 'err');
        })
        loading_h.close()
      }
    })
  }

  React.useEffect(() => {
    handleUsers()

    return () => {
      setUsers([]);
    }
  }, [])

  if (!loading && !user?.id) return <Navigate to={'/login'}/>

  if (create) {
    return (
      <div className='p-3'>
        <Button
          onClick={() => create_h.close()}
          variant='light'
        >
          Назад
        </Button>
        <div className='max-w-sm mx-auto space-y-2 shadow border p-3'>
          <p>Создание пользователя</p>
          <TextInput
            label="Имя"
            variant='filled'
            value={createData.name}
            onChange={(e) => setCreateData({...createData, name: e.currentTarget.value})}
          />
          <TextInput
            label="Телефон"
            variant='filled'
            value={createData.phone}
            onChange={(e) => setCreateData({...createData, phone: e.currentTarget.value})}
          />
          <TextInput
            type='email'
            label="Почта"
            variant='filled'
            value={createData.nemailame}
            onChange={(e) => setCreateData({...createData, email: e.currentTarget.value})}
          />
          <TextInput
            label="ИИН"
            variant='filled'
            value={createData.iin}
            onChange={(e) => setCreateData({...createData, iin: e.currentTarget.value})}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={createUser} loading={load}>
              Добавить
            </Button>
          </div>
        </div>
        
      </div>
    )
  }

  if (edit) {
    return (
      <div className='p-3'>
        <Button
          onClick={() => edit_h.close()}
          variant='light'
        >
          Назад
        </Button>
        <div className='max-w-sm mx-auto space-y-2 shadow border p-3'>
          <p>Редактирование пользователя</p>
          <TextInput
            label="Имя"
            variant='filled'
            value={editData.name ?? ''}
            onChange={(e) => setEditData({...editData, name: e.currentTarget.value})}
          />
          <TextInput
            label="Телефон"
            variant='filled'
            value={editData.phone ?? ''}
            onChange={(e) => setEditData({...editData, phone: e.currentTarget.value})}
          />
          <TextInput
            type='email'
            label="Почта"
            variant='filled'
            value={editData.email ?? ''}
            onChange={(e) => setEditData({...editData, email: e.currentTarget.value})}
          />
          <TextInput
            label="ИИН"
            variant='filled'
            value={editData.iin ?? ''}
            onChange={(e) => setEditData({...editData, iin: e.currentTarget.value})}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={editUser} loading={load}>
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full h-full p-3">
        <div className='flex justify-between'>
          <Button
            variant="light"
            onClick={() => navigate('/')}
          >
            Карта
          </Button>
          <Button
            variant="light"
            onClick={() => {
              logout()
              window.location.reload()
            }}
          >
            Выйти
          </Button>
        </div>
        <LoadingOverlay visible={load}/>
        <Table
          className="mt-4"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                Дата создания
              </Table.Th>
              <Table.Th>
                Аватар
              </Table.Th>
              <Table.Th>
                Имя
              </Table.Th>
              <Table.Th>
                Телефон
              </Table.Th>
              <Table.Th>
                Почта
              </Table.Th>
              <Table.Th>
                ИИН
              </Table.Th>
              <Table.Th>
                Устройство
              </Table.Th>
              <Table.Th>
                Статус
              </Table.Th>
              <Table.Th>
                Действие
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((q, i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  {dayjs(q?.created).format('DD.MM.YYYY')}
                </Table.Td>
                <Table.Td>
                  <Avatar
                    src={pb.files.getURL(q, q?.avatar)}
                  />
                </Table.Td>
                <Table.Td>
                  {q.name}
                </Table.Td>
                <Table.Td>
                  {q.phone}
                </Table.Td>
                <Table.Td>
                  {q.email}
                </Table.Td>
                <Table.Td>
                  {q.iin}
                </Table.Td>

                <Table.Td>
                  {(q?.devices?.length !== 0 && q?.devices) ?  q?.devices?.map((w, index) => {
                    return (
                      <div key={index} className='border p-3 mt-2 w-fit'>
                        <p className='flex justify-between w-full'>Тип: {w?.DeviceType?.[w?.deviceType]}</p>
                        <p className='flex justify-between w-full'>Платформа: {w?.osName}</p>
                        <p className='flex justify-between w-full'>Брэнд: {w?.brand}</p>
                        <p className='flex justify-between w-full'>Название: {w?.deviceName}</p>
                        <p className='flex justify-between w-full'>Модель: {w?.modelName}</p>
                        <p className='flex justify-between w-full'>Версия: {w?.osVersion}</p>
                      </div>
                    )
                  }) : 'Нет данных'}
                </Table.Td>
                <Table.Td>
                  {(q?.status === 'active' || q?.status === '') && <span className='text-green-500'>Активен</span>}
                  {q?.status === 'lost' && <span className='text-red-500'>Потерян</span>}
                </Table.Td>
                <Table.Td>
                  <Menu>
                    <Menu.Target>
                      <HiDotsVertical size={25} />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => {
                        notificationModal_h.open()
                        setReceiver(q)
                        setNotificationError('')
                        setMessage('')
                      }}>
                        Отправить уведомление
                      </Menu.Item>
                      <Menu.Item onClick={() => {
                          edit_h.open()
                          setEditData(q)
                        }}
                      >
                        Редактировать
                      </Menu.Item>
                      <Menu.Item onClick={() => deleteUser(q)}>
                        Удалить
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <div className="w-full flex justify-end mt-4">
          <Button onClick={() => create_h.open()}>
            Добавить пользователя
          </Button>
        </div>
      </div>
      <Modal
        opened={passwordModal}
        onClose={() => passwordModal_h.close()}
        title='Пароль пользователя'
        centered
        closeOnClickOutside={false}
        lockScroll
      >
        <div className='text-center space-y-2'>
          <p className='text-lg'>{password}</p>
          <CopyButton value={password}>
            {({ copied, copy }) => (
              <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                {copied ? 'Скопировано' : 'Скопировать'}
              </Button>
            )}
          </CopyButton>
        </div>
      </Modal>
      <Modal
        opened={notificationModal}
        centered
        onClose={() => {
          notificationModal_h.close()
          setMessage('')
          setReceiver({})
          setNotificationError('')
        }}
        title='Отправка уведомления'
      >
        <p></p>
        <Textarea
          autosize
          value={message}
          onChange={e => setMessage(e?.currentTarget?.value)}
          placeholder='Сообщение'
          variant='filled'
          label={`Сообщение для ${receiver?.name}`}
          minRows={3}
          disabled={sendLoading}
        />
        {notificationError && <p className='text-sm text-red-500 mt-3'>{notificationError}</p>}
        <div className='flex justify-center mt-4'>
          <Button
            loading={sendLoading}
            onClick={sendNotification}
          >
            Отправить уведомление
          </Button>
        </div>
      </Modal>
    </>
  )
}