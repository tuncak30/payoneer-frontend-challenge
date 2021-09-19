import {Grid, Skeleton} from "@mui/material";
function InnerTemperatures(props){
    const {
        loading,
        card,
        idx,
        icon,
        unit
    } = props;
    return(
        <>
        {
            loading ?
                <Grid item xs={3} >
                    <Skeleton className="temperature-skeleton" height={80} width="90%"/>
                </Grid> :
                <Grid item xs={3} >
                    <div className="hourly-temperature-container">
                        <div className="hours text-center">{card.hours[idx]}</div>
                        <img alt={icon} className="small-weather-image" src={`http://openweathermap.org/img/wn/${icon}@2x.png`}/>
                        <div className="hourly-temperature text-center">{`${Math.round(card.temperatures[idx])} ${unit === "metric" ? "℃" : "℉"}`} </div>
                    </div>
                </Grid>
        }
        </>
    )
}

export default InnerTemperatures;