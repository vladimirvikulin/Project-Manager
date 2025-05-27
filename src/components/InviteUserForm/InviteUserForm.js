import React from 'react';
import MyModal from '../ui/modal/MyModal';
import styles from './InviteUserForm.module.css';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';

const InviteUserForm = ({ visible, setVisible, inviteEmail, setInviteEmail, handleInviteUser }) => {
    return (
        <MyModal visible={visible} setVisible={setVisible}>
            <div className={styles.inviteForm}>
                <h3>Запросити користувача</h3>
                <form onSubmit={handleInviteUser}>
                    <MyInput
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        type="email"
                        placeholder="Електронна адреса"
                    />
                    <MyButton type="submit">Надіслати запрошення</MyButton>
                </form>
            </div>
        </MyModal>
    );
};

export default InviteUserForm;