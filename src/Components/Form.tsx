import React, { useState } from "react";

import "../style/Form.css";
// import useStyles from '../style/styles'

import {
  Tabs,
  Tab,
  Grid,
  GridSize,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Button,
  Collapse,
  Card,
  CardContent,
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { SortOrder, SortTypes } from "../types";

const Form: React.FC<any> = ({
  handleChange,
  handleSubmit,
  searchOption,
  author,
  title,
  subreddit,
  searchTerm,
  size,
  after,
  before,
  sort,
  sortType,
  isLoading,
}) => {
  // for material ui styles
  // const classes = useStyles()

  const formDimensions: Record<Breakpoint, GridSize> = {
    xs: 10,
    sm: 10,
    md: 6,
    lg: 6,
    xl: 6,
  };
  const [showFilters, setShowFilters] = useState(false);

  // show or hide filters
  const changeFilter = () => {
    const curState = showFilters;
    setShowFilters(!curState);
  };

  return (
    <div>
      <Grid container direction='column' alignItems='center' spacing={3}>
        <Grid item {...formDimensions}>
          <form onSubmit={handleSubmit} className='Form'>
            <div className='TabBar'>
              <Tabs
                value={searchOption}
                onChange={handleChange}
                TabIndicatorProps={{ style: { background: "#FF5700" } }}
                centered
              >
                <Tab label='Posts' />
                <Tab label='Comments' />
              </Tabs>
            </div>
            <Card>
              <CardContent>
                <div className='Inputs'>
                  <Grid container spacing={3} justify='center'>
                    <Grid item sm={4} xs={12}>
                      <TextField
                        label='Author'
                        fullWidth
                        className='InputAuthor'
                        type='text'
                        name='author'
                        onChange={handleChange}
                        value={author}
                      />
                    </Grid>

                    <Grid item sm={4} xs={12}>
                      <TextField
                        label='Subreddit'
                        fullWidth
                        className='InputSubreddit'
                        type='text'
                        name='subreddit'
                        onChange={handleChange}
                        value={subreddit}
                      />
                    </Grid>

                    <Grid item sm={4} xs={12}>
                      <TextField
                        label='Title'
                        fullWidth
                        className='InputTitle'
                        type='text'
                        name='title'
                        onChange={handleChange}
                        value={title}
                      />
                    </Grid>

                    <Grid item sm={8} xs={12}>
                      <TextField
                        label='Search Term'
                        fullWidth
                        className='InputSearchTerm'
                        type='text'
                        name='searchTerm'
                        onChange={handleChange}
                        value={searchTerm}
                      />
                    </Grid>

                    <Grid item sm={4} xs={12}>
                      <TextField
                        label='Return Size'
                        fullWidth
                        className='InputReturnSize'
                        type='number'
                        name='size'
                        onChange={handleChange}
                        value={size}
                      />
                    </Grid>

                    <Grid item container xs={12} justify='center'>
                      <div style={{ margin: 25 }}>
                        <Button onClick={changeFilter}>
                          {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                      </div>
                    </Grid>

                    <Collapse in={showFilters}>
                      <Grid
                        container
                        justify='center'
                        alignItems='center'
                        spacing={5}
                      >
                        <Grid
                          item
                          container
                          direction='column'
                          sm={6}
                          xs={12}
                          spacing={3}
                          alignItems='center'
                        >
                          <Grid item>
                            <FormControl style={{ minWidth: 200 }}>
                              <InputLabel>Sort Type</InputLabel>
                              <Select
                                autoWidth
                                label='Sort Type'
                                name='sortType'
                                onChange={handleChange}
                                value={sortType}
                              >
                                <MenuItem value={SortTypes.Score}>
                                  Score
                                </MenuItem>
                                <MenuItem value={SortTypes.NumComments}>
                                  Num. of Comments
                                </MenuItem>
                                <MenuItem value={SortTypes.Date}>
                                  Created Date
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item>
                            <FormControl style={{ minWidth: 200 }}>
                              <InputLabel>Sort Order</InputLabel>
                              <Select
                                label='Sort Order'
                                name='sort'
                                onChange={handleChange}
                                value={sort}
                              >
                                <MenuItem value={SortOrder.DESC}>
                                  Descending
                                </MenuItem>
                                <MenuItem value={SortOrder.ASC}>
                                  Ascending
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          direction='column'
                          sm={6}
                          xs={12}
                          spacing={3}
                          alignItems='center'
                        >
                          <Grid item>
                            {/* need InputLabelProps={{ shrink: true }}  to prevent overlap of label */}
                            <TextField
                              label='After'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                              type='date'
                              name='after'
                              onChange={handleChange}
                              value={after}
                            />
                          </Grid>

                          <Grid item>
                            <TextField
                              label='Before'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                              type='date'
                              name='before'
                              onChange={handleChange}
                              value={before}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Collapse>

                    <Grid item container>
                      <button type='submit' className='SearchButton'>
                        {isLoading ? "Searching ..." : "Search"}
                      </button>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default Form;
