import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import { getUserList } from "../admin/Users/Users.Slice";
import { getGroupsAction } from "../admin/Groups/Groups.Slice";
import { getStudentsAction } from "../admin/Students/Student.Slice";
import { getTeachersAction } from "./Homework.Slice";

export const Teacher = () => {
  const account = useOutletContext();
  // console.log(account);
  const allGroups = useSelector((state) => state.groups.groups);
  // console.log(allGroups);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getGroupsAction());
    dispatch(getTeachersAction());
    dispatch(getStudentsAction());
  }, []);

  return (
    <div>
      <h1>
        Teacher {account.name} {account.surname}
      </h1>
      <table
        className="table table-bordered table-dark"
        style={{ width: 1000 }}
      >
        <thead>
          <tr>
            <th>g. name</th>
            <th>students</th>
            <th>schedule</th>
            <th>hours</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {account.groups.map((elm, i) => {
            const foundGroup = allGroups?.find((group) => group.id == elm);

            return (
              foundGroup && (
                <tr key={i}>
                  <td>{foundGroup.name}</td>
                  <td>
                    {foundGroup.students.map((stud) => {
                      return (
                        <div key={stud.id}>
                          <p>
                            {stud.name} {stud.surname}
                          </p>
                        </div>
                      );
                    })}
                  </td>
                  <td>
                    {foundGroup.schedule == "v1"
                      ? "Monday,Wednesday,Friday"
                      : "Tuesday,Thursday,Saturday"}
                  </td>
                  <td>
                    {foundGroup.hours == "vi"
                      ? "10:00-12:00"
                      : foundGroup.hours == "v2"
                      ? "12:00-14:00"
                      : foundGroup.hours == "v3"
                      ? "14:00-16:00"
                      : foundGroup.hours == "v4"
                      ? "16:00-18:00"
                      : "18:00-20:00"}
                  </td>
                  <td></td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

