import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import { DateTime } from "../../../components/Date";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { renderCollection } from "../../../misc";
import { Home_activities_edges_node } from "../../types/Home";
import { getActivityMessage } from "./activityMessages";

const styles = createStyles({
  loadingSkills: {
    paddingBottom: "10px",
    paddingTop: "10px"
  },
  noSkills: {
    paddingBottom: "16px",
    paddingTop: "16px"
  }
});

interface HomeSkillListCardProps extends WithStyles<typeof styles> {
  activities: Home_activities_edges_node[];
}

const HomeSkillListCard = withStyles(styles, { name: "HomeSkillListCard" })(
  ({ classes, activities }: HomeSkillListCardProps) => {
    return (
      <Card>
        <CardTitle title={i18n.t("Activity")} />
        <List dense={true}>
          {renderCollection(
            activities,
            (activity, activityId) => (
              <ListItem key={activityId}>
                {activity ? (
                  <ListItemText
                    primary={
                      <Typography>{getActivityMessage(activity)}</Typography>
                    }
                    secondary={<DateTime date={activity.date} />}
                  />
                ) : (
                  <ListItemText className={classes.loadingSkills}>
                    <Typography>
                      <Skeleton />
                    </Typography>
                  </ListItemText>
                )}
              </ListItem>
            ),
            () => (
              <ListItem className={classes.noSkills}>
                <ListItemText
                  primary={
                    <Typography>{i18n.t("No activities found")}</Typography>
                  }
                />
              </ListItem>
            )
          )}
        </List>
      </Card>
    );
  }
);
HomeSkillListCard.displayName = "HomeSkillListCard";
export default HomeSkillListCard;
