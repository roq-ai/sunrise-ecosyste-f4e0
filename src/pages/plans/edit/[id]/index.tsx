import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPlanById, updatePlanById } from 'apiSdk/plans';
import { Error } from 'components/error';
import { planValidationSchema } from 'validationSchema/plans';
import { PlanInterface } from 'interfaces/plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function PlanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlanInterface>(
    () => (id ? `/plans/${id}` : null),
    () => getPlanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/plans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlanInterface>({
    initialValues: data,
    validationSchema: planValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="wake_up_time" mb="4">
              <FormLabel>Wake Up Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.wake_up_time ? new Date(formik.values?.wake_up_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('wake_up_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="walking_route" mb="4" isInvalid={!!formik.errors?.walking_route}>
              <FormLabel>Walking Route</FormLabel>
              <Input
                type="text"
                name="walking_route"
                value={formik.values?.walking_route}
                onChange={formik.handleChange}
              />
              {formik.errors.walking_route && <FormErrorMessage>{formik.errors?.walking_route}</FormErrorMessage>}
            </FormControl>
            <FormControl id="meal_plan" mb="4" isInvalid={!!formik.errors?.meal_plan}>
              <FormLabel>Meal Plan</FormLabel>
              <Input type="text" name="meal_plan" value={formik.values?.meal_plan} onChange={formik.handleChange} />
              {formik.errors.meal_plan && <FormErrorMessage>{formik.errors?.meal_plan}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'plan',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PlanEditPage);
