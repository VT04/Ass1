import React from 'react'
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineVideoLibrary, MdOutlineDriveFolderUpload } from "react-icons/md";

export const MenuData = [
    {
        title: 'My Videos',
        path: '/videos',
        icon: <MdOutlineVideoLibrary />,
        cName: 'nav-text'
    },
    {
        title: 'Upload Videos',
        path: '/upload',
        icon: <MdOutlineDriveFolderUpload />,
        cName: 'nav-text'
    },

    {
        title: 'Sign Out',
        path: '/',
        icon: <TbLogout2 />,
        cName: 'nav-text'
    },
]
