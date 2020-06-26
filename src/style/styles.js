import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    searchButton: {
        background: '#0077D6',
        border: "1px solid white",
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        marginTop: 25,
        "&:hover":{
            background: "white",
            color: "#0077D6",
            borderColor: "#0077D6"
        }
    },
});

export default useStyles