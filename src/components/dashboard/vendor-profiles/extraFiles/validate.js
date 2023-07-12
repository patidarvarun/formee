const validate = values => {
  
  const errors = {};
  if (!values.members || !values.members.length) {
    errors.members = { _error: 'At least one member must be entered' };
  } else {
    const membersArrayErrors = [];
    values.members.forEach((member, memberIndex) => {
      const memberErrors = {};
      if (!member || !member.class_name) {
        memberErrors.class_name = 'Class Name is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.wellbeing_fitness_type_id) {
        memberErrors.wellbeing_fitness_type_id = 'Fitness type is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.instructor_name) {
        memberErrors.instructor_name = 'Instructor Name is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.description) {
        // memberErrors.description = 'Details is Required';
        // membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.room) {
        memberErrors.room = 'Rooms is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.capacity) {
        memberErrors.capacity = 'Capacity is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.price) {
        memberErrors.price = 'Price is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (!member || !member.time) {
        memberErrors.time = 'Time is Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }
      if (member && member.monday && member.monday.length) {
        
        const hobbyArrayErrors = [];
        member.monday.forEach((hobby, hobbyIndex) => {
          
          if (!hobby || !hobby.length) {
            hobbyArrayErrors[hobbyIndex] = 'Required';
          }
        });
        if (hobbyArrayErrors.length) {
          memberErrors.hobbies = hobbyArrayErrors;
          membersArrayErrors[memberIndex] = memberErrors;
        }
        // if (member.hobbies.length > 5) {
        //   if (!memberErrors.hobbies) {
        //     memberErrors.hobbies = [];
        //   }
        //   memberErrors.hobbies._error = 'No more than five hobbies allowed';
        //   membersArrayErrors[memberIndex] = memberErrors;
        // }
      }
    });
    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors;
    }
  }
  
  return errors;

};

export default validate;
