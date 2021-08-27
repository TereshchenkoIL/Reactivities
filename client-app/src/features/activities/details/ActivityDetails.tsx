import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import AcctivityDetailedSidebar from "./ActivityDetaildeSidebat";
import AcctivityDetailedChat from "./ActivityDetailedChat";
import AcctivityDetailedHeader from "./ActivityDetailedHeader";
import AcctivityDetailedInfo from "./ActivityDetailedInfo";


export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) loadActivity(id)
    }, [id, loadActivity])

    console.log(activity)
    if (loadingInitial || !activity) return <LoadingComponent content='' />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <AcctivityDetailedHeader activity={activity} />
                <AcctivityDetailedInfo activity={activity} />
                <AcctivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <AcctivityDetailedSidebar activity={activity} />
            </Grid.Column>
        </Grid>
    );
})