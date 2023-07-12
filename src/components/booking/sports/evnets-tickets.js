import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { TEMPLATE } from '../../../config/Config'
import { capitalizeFirstLetter } from '../../common'
import { getBookingSportsSearchRoute } from '../../../common/getRoutes'