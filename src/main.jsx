import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from 'react-router';
import { ModalsProvider } from '@mantine/modals';

import { router } from 'router';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <Notifications position='top-right'/>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
