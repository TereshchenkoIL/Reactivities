
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

import ProfileUpdateFrom from "./ProfileUpdateFrom";

export default observer(function RegisterForm() {

    const { profileStore } = useStore();
    const [updateProfileMode, setUpdateProfileMode] = useState(false);
    return (
        <Tab.Pane>

            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profileStore.profile?.displayName}`} />

                    <Button floated='right'
                        content={updateProfileMode ? 'Cancel' : 'Update Profile'}
                        onClick={() => setUpdateProfileMode(!updateProfileMode)}
                    />
                </Grid.Column>
            </Grid>
            {updateProfileMode ? <ProfileUpdateFrom updateProdileMode={setUpdateProfileMode} /> :
                <>
                    <Header as='h3'>{profileStore.profile?.displayName}</Header>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{profileStore.profile?.bio}</span>
                </>
            }

        </Tab.Pane>
    );
})