/*
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Render base for dialogs.
 * @returns {TSX} Header AppBar components.
 */
 export default function FormDialogBase({
    title,
    children,
    icon,
    saveButtonText,
    formSaveCallback,
    dialogOpenCallback,
    triggerIconProps,
}) {
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = useState(false);

    const handleClickOpen = () => {
        dialogOpenCallback();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveTriggerd = () => {
        const savedPromise = formSaveCallback();
        if (typeof savedPromise === 'function') {
            savedPromise(setOpen);
        } else if (savedPromise) {
            setSaving(true);
            savedPromise.then((data) => {
                console.log("hhhh");
            }).catch((e) => {
                console.log("ggg");
            }).finally(() => {
                setSaving(false);
                handleClose();
            });
        }
    };

    return (
        <>
            {icon && (
                <IconButton {...triggerIconProps} onClick={handleClickOpen}>
                    {icon}
                </IconButton>
            )}

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={saveTriggerd}
                        color='primary'
                        variant='contained'
                        disabled={saving}
                        data-testid={saveButtonText + '-btn'}
                    >
                        {saving ? (<CircularProgress size={16} />) : (<>{saveButtonText}</>)}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
FormDialogBase.defaultProps = {
    dialogOpenCallback: () => {},
    triggerButtonProps: {
        variant: 'contained',
        color: 'primary',
    },
    triggerIconProps: {
        color: 'primary',
        component: 'span',
    },
};

FormDialogBase.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    icon: PropTypes.element.isRequired,
    saveButtonText: PropTypes.string.isRequired,
    formSaveCallback: PropTypes.func.isRequired,
    dialogOpenCallback: PropTypes.func,
};

