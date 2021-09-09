import { observer } from "mobx-react-lite";
import React from "react";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";
import ProfileEventCard from "./ProfileEventCard";


export default observer(function ProfileActivities() {
    const { profileStore } = useStore();

    const { activities, loadingActivities } = profileStore;

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>

                <Grid.Column width={16}>
                    <Card.Group>
                        {activities.map(activity => (
                            <ProfileEventCard activity={activity} />
                        ))}
                    </Card.Group>

                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})