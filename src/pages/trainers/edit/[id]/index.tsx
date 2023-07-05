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
import { getTrainerById, updateTrainerById } from 'apiSdk/trainers';
import { Error } from 'components/error';
import { trainerValidationSchema } from 'validationSchema/trainers';
import { TrainerInterface } from 'interfaces/trainer';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function TrainerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TrainerInterface>(
    () => (id ? `/trainers/${id}` : null),
    () => getTrainerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TrainerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTrainerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/trainers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TrainerInterface>({
    initialValues: data,
    validationSchema: trainerValidationSchema,
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
            Edit Trainer
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
            <FormControl id="availability" mb="4" isInvalid={!!formik.errors?.availability}>
              <FormLabel>Availability</FormLabel>
              <Input
                type="text"
                name="availability"
                value={formik.values?.availability}
                onChange={formik.handleChange}
              />
              {formik.errors.availability && <FormErrorMessage>{formik.errors?.availability}</FormErrorMessage>}
            </FormControl>
            <FormControl id="qualifications" mb="4" isInvalid={!!formik.errors?.qualifications}>
              <FormLabel>Qualifications</FormLabel>
              <Input
                type="text"
                name="qualifications"
                value={formik.values?.qualifications}
                onChange={formik.handleChange}
              />
              {formik.errors.qualifications && <FormErrorMessage>{formik.errors?.qualifications}</FormErrorMessage>}
            </FormControl>
            <FormControl id="experience" mb="4" isInvalid={!!formik.errors?.experience}>
              <FormLabel>Experience</FormLabel>
              <Input type="text" name="experience" value={formik.values?.experience} onChange={formik.handleChange} />
              {formik.errors.experience && <FormErrorMessage>{formik.errors?.experience}</FormErrorMessage>}
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
    entity: 'trainer',
    operation: AccessOperationEnum.UPDATE,
  }),
)(TrainerEditPage);
