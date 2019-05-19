import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";

const styles = (theme: Theme) =>
  createStyles({
    headerContainer: {
      marginBottom: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 3
    },
    pageHeader: {
      fontWeight: 600 as 600
    }
  });

interface HomeTasksCardProps extends WithStyles<typeof styles> {
  userName: string;
}

const HomeTasksCard = withStyles(styles, { name: "HomeTasksCard" })(
  ({ classes, userName }: HomeTasksCardProps) => {
    return (
      <div className={classes.headerContainer}>
        <Typography className={classes.pageHeader} variant="headline">
          {userName ? (
            i18n.t("Hello there, {{userName}}", { userName })
          ) : (
            <Skeleton style={{ width: "10em" }} />
          )}
        </Typography>
        <Typography>
          {userName ? (
            i18n.t("Here are some information we gathered about your store")
          ) : (
            <Skeleton style={{ width: "10em" }} />
          )}
        </Typography>
      </div>
    );
  }
);
HomeTasksCard.displayName = "HomeTasksCard";
export default HomeTasksCard;
