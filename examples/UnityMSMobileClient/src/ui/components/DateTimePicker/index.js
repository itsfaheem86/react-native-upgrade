import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  CommonNumbers,
  DateTimeInitialValues,
  ValidationNumbers,
} from '@constants/numbers';
import {
  DateTimeFormats,
  IconNames,
  KeyboardTypes,
  ReplaceableTokens,
} from '@constants/strings';
import {useTheme} from '@theme';
import TextInput from '@ui/atoms/TextInput';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconButton from '../IconButton';
import styles from './styles';

const DateTimePicker = props => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {onDateTimeChange, dateTime, maximumDate, minimumDate, valid} = props;
  const currentYear = moment(dateTime).year();
  const currentMonth = moment(dateTime).month() + CommonNumbers.one;
  const currentDate = moment(dateTime).date();
  const [{year, month, date, isDatePickerVisible}, setDateTimeData] = useState({
    year: currentYear,
    month: currentMonth,
    date: currentDate,
    isDatePickerVisible: false,
  });

  const getDateTime = (year, month, date) => {
    return moment(
      [
        +year || DateTimeInitialValues.year,
        +month || DateTimeInitialValues.month,
        +date || DateTimeInitialValues.date,
      ].join(ReplaceableTokens.slash),
      DateTimeFormats.yearMonthDate,
    ).toDate();
  };

  useEffect(() => {
    onDateTimeChange(getDateTime(year, month, date));
  }, [year, month, date]);

  const showDateTimePicker = () => {
    setDateTimeData(prevDateTime => ({
      ...prevDateTime,
      isDatePickerVisible: true,
    }));
  };

  const onCancel = () => {
    setDateTimeData(prevDateTime => ({
      ...prevDateTime,
      isDatePickerVisible: false,
    }));
  };

  const onConfirm = date => {
    const momentDate = moment(date);
    setDateTimeData({
      year: momentDate.year(),
      month: momentDate.month() + CommonNumbers.one,
      date: momentDate.date(),
      isDatePickerVisible: false,
    });
  };

  const modifyDateIfNotValid = (year, month, date) => {
    const maxDate = moment().year(year).month(month).daysInMonth();
    let updatedDate = date > maxDate ? maxDate : date;
    if (updatedDate?.length === CommonNumbers.two) {
      updatedDate =
        updatedDate < ValidationNumbers.minDaysInMonth
          ? ValidationNumbers.minDaysInMonth
          : updatedDate;
    }
    setDateTimeData(prevDateTime => ({
      ...prevDateTime,
      date: updatedDate,
    }));
  };

  const onChangeYear = text => {
    // Check year can be valid or not and update accordingly
    let updatedText =
      text > ValidationNumbers.maxYear ? ValidationNumbers.maxYear : text;
    if (updatedText?.length === CommonNumbers.four) {
      updatedText =
        updatedText < ValidationNumbers.minYear
          ? ValidationNumbers.minYear
          : updatedText;
    }
    setDateTimeData(prevDateTime => ({
      ...prevDateTime,
      year: updatedText,
    }));
    // Check date can be valid for the year or not and update accordingly
    modifyDateIfNotValid(updatedText, month - CommonNumbers.one, date);
  };

  const onChangeMonth = text => {
    // Check month can be valid or not and update accordingly
    let updatedText =
      text > ValidationNumbers.maxMonthsInYear
        ? ValidationNumbers.maxMonthsInYear
        : text;
    if (updatedText?.length === CommonNumbers.two) {
      updatedText =
        updatedText < ValidationNumbers.minMonthsInYear
          ? ValidationNumbers.minMonthsInYear
          : updatedText;
    }
    setDateTimeData(prevDateTime => ({
      ...prevDateTime,
      month: updatedText,
    }));

    // Check date can be valid for the month or not and update accordingly
    modifyDateIfNotValid(year, updatedText - CommonNumbers.one, date);
  };

  const onChangeDate = text => {
    // Check date can be valid or not and update accordingly
    modifyDateIfNotValid(year, month - CommonNumbers.one, text);
  };

  return (
    <View style={[styles.container]}>
      <TextInput
        placeholder={t('YYYY')}
        containerStyle={[styles.dateContainer, CommonStyles.bigMarginRight]}
        onChangeText={onChangeYear}
        value={year?.toString()}
        keyboardType={KeyboardTypes.numeric}
        maxLength={CommonNumbers.four}
        valid={valid}
      />
      <TextInput
        placeholder={t('MM')}
        containerStyle={[styles.dateContainer, CommonStyles.bigMarginRight]}
        onChangeText={onChangeMonth}
        value={month?.toString()}
        keyboardType={KeyboardTypes.numeric}
        maxLength={CommonNumbers.two}
        valid={valid}
      />
      <TextInput
        placeholder={t('DD')}
        containerStyle={[styles.dateContainer, CommonStyles.bigMarginRight]}
        onChangeText={onChangeDate}
        value={date?.toString()}
        keyboardType={KeyboardTypes.numeric}
        maxLength={CommonNumbers.two}
        valid={valid}
      />
      <IconButton
        iconName={IconNames.calendarAlt}
        onPress={showDateTimePicker}
        iconStyle={[valid ? {} : {color: colors.error}]}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        onConfirm={onConfirm}
        onCancel={onCancel}
        date={getDateTime(year, month, date)}
        negativeButtonLabel={t('Cancel')}
        positiveButtonLabel={t('Ok')}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </View>
  );
};

DateTimePicker.propTypes = {
  onDateTimeChange: PropTypes.func,
};

export default DateTimePicker;
