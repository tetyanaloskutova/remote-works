import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import AttachMoney from "@material-ui/icons/AttachMoney";
import LocalDelivery from "@material-ui/icons/LocalDelivery";
import * as React from "react";

import CardSpacer from "../../../components/CardSpacer";
import Container from "../../../components/Container";
import Grid from "../../../components/Grid";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import {
  Home_activities_edges_node,
  Home_skillTopToday_edges_node,
  Home_salesToday_gross
} from "../../types/Home";
import HomeActivityCard from "../HomeActivityCard";
import HomeAnalyticsCard from "../HomeAnalyticsCard";
import HomeHeader from "../HomeHeader";
import HomeNotificationTable from "../HomeNotificationTable/HomeNotificationTable";
import HomeSkillListCard from "../HomeSkillListCard";

const styles = (theme: Theme) =>
  createStyles({
    cardContainer: {
      display: "grid",
      gridColumnGap: `${theme.spacing.unit * 3}px`,
      gridTemplateColumns: "1fr 1fr",
      [theme.breakpoints.down("sm")]: {
        gridColumnGap: `${theme.spacing.unit}px`
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr"
      }
    }
  });

export interface HomePageProps extends WithStyles<typeof styles> {
  activities: Home_activities_edges_node[];
  tasks: number;
  ordersToCapture: number;
  ordersToFulfill: number;
  skillsOutOfStock: number;
  sales: Home_salesToday_gross;
  topSkills: Home_skillTopToday_edges_node[];
  userName: string;
  onTasksToCaptureClick: () => void;
  onTasksToFulfillClick: () => void;
  onSkillClick: (skillId: string, variantId: string) => void;
  onSkillsOutOfStockClick: () => void;
}

const HomePage = withStyles(styles, { name: "HomePage" })(
  ({
    classes,
    userName,
    tasks,
    sales,
    topSkills,
    onSkillClick,
    activities,
    onTasksToCaptureClick,
    onTasksToFulfillClick,
    onSkillsOutOfStockClick,
    ordersToCapture,
    ordersToFulfill,
    skillsOutOfStock
  }: HomePageProps) => (
    <Container width="md">
      <HomeHeader userName={userName} />
      <CardSpacer />
      <Grid>
        <div>
          <div className={classes.cardContainer}>
            <HomeAnalyticsCard
              title={"Sales"}
              icon={<AttachMoney fontSize={"inherit"} />}
            >
              {sales ? (
                <Money money={sales} />
              ) : (
                <Skeleton style={{ width: "5em" }} />
              )}
            </HomeAnalyticsCard>
            <HomeAnalyticsCard
              title={"Tasks"}
              icon={<LocalDelivery fontSize={"inherit"} />}
            >
              {tasks === undefined ? (
                <Skeleton style={{ width: "5em" }} />
              ) : (
                tasks
              )}
            </HomeAnalyticsCard>
          </div>
          <HomeNotificationTable
            onTasksToCaptureClick={onTasksToCaptureClick}
            onTasksToFulfillClick={onTasksToFulfillClick}
            onSkillsOutOfStockClick={onSkillsOutOfStockClick}
            ordersToCapture={ordersToCapture}
            ordersToFulfill={ordersToFulfill}
            skillsOutOfStock={skillsOutOfStock}
          />
          <CardSpacer />
          <HomeSkillListCard
            onRowClick={onSkillClick}
            topSkills={topSkills}
          />
          <CardSpacer />
        </div>
        <div>
          <HomeActivityCard activities={activities} />
        </div>
      </Grid>
    </Container>
  )
);
HomePage.displayName = "HomePage";
export default HomePage;
