import React from "react";
import loading from "../images/loading.svg";
import { Grid, Typography } from "@material-ui/core";
import { SortOrder, SortTypes } from "../types";

const Content: React.FC<any> = ({
  isLoading,
  contentList,
  setAfter,
  setBefore,
  sort,
  sortType,
  handleSubmit,
  apiResponse,
}) => {
  const showLoadMoreButton = () =>
    contentList.length && sortType === SortTypes.Date;

  const handleLoad = (event: any) => {
    const pivot = new Date(
      apiResponse[apiResponse.length - 1].created_utc * 1000
    );
    if (sort === SortOrder.ASC) {
      setAfter(pivot);
    } else {
      setBefore(pivot);
    }
    handleSubmit(event);
  };

  const LoadMore = (isLoading: boolean) => (
    <button onClick={handleLoad} className='SearchButton'>
      {isLoading ? "Loading ..." : "Load More"}
    </button>
  );

  const getMessage = () => (
    <>
      <Grid item container spacing={3} justify='center' alignItems='center'>
        <Typography variant='h5'>
          Number of Results Shown: {contentList.length}
        </Typography>
      </Grid>
      <Grid item container spacing={3} justify='center' alignItems='center'>
        <Typography>
          Sort by created date to automatically fetch more results
        </Typography>
      </Grid>
    </>
  );

  return (
    <Grid container direction='column' alignItems='center' spacing={3}>
      <Grid item container spacing={3} justify='center' alignItems='center'>
        {contentList.length > 0 && getMessage()}
        {isLoading ? <img src={loading} alt='loading'></img> : contentList}
      </Grid>
      <Grid item container>
        {showLoadMoreButton() ? LoadMore(isLoading) : <></>}
      </Grid>
    </Grid>
  );
};

export default Content;
