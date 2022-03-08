import React, { Fragment } from 'react';
import './analyticsCard.scss';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const AnalyticsCard = ({ title, value, icon }) => {
    return(<Fragment>
        <Card>
            <CardContent>
                <div className="analyticscard">
                    <div className="analyticscard__icon">
                        {icon}
                    </div>
                    <div className="analyticscard__details">
                        <Typography color="textSecondary" gutterBottom>{title}</Typography>
                        <Typography color="textPrimary" variant="h4">{value}</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Fragment>);
}

export default AnalyticsCard;