/** @format */

import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AuthStore } from "@/stores/auth";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
type ProfileInfo = {
  first_name: string;
  last_name: string;
  username: string;
  address: string;
};

type Props = {
  tran: (text: string) => string;
};
const UpdateUserProfile: React.FC<Props> = ({ tran }) => {
  const { user, getUser } = useAuthStore((state: AuthStore) => state);

  const [updateProfileInfo, setUpdateProfileInfo] = useState<ProfileInfo>({
    first_name: "",
    last_name: "",
    username: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setUpdateProfileInfo({
        first_name: user?.first_name ? user?.first_name : "",
        last_name: user?.last_name ? user?.last_name : "",
        username: user?.username,
        address: user?.address ? user?.address : "",
      });
    }
  }, [user]);

  const {
    mutate: profileInfo,
    isLoading: profileInfoUpdateLoading,
    backendErrors: errors,
  } = useQueryMutation({
    url: "/profile/update-profile",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    profileInfo(updateProfileInfo, {
      onSuccess: () => {
        toast.success(tran("Profile updated successfully."));
        getUser();
      },
    });
  };
  return (
    <div className="rounded-lg bg-white p-6 pt-6">
      <div className="flex flex-col pb-1">
        <p className="text-xl font-medium">{tran("Profile Information")}</p>
        <p className="text-sm text-slate-500">
          {tran("You can update your profile information here.")}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-3">
        <InputGroup
          label={tran("First Name")}
          name="first_name"
          value={updateProfileInfo.first_name}
          onChange={(e) =>
            setUpdateProfileInfo((prev) => ({
              ...prev,
              first_name: e,
            }))
          }
          errors={errors}
          placeholder={tran("Enter New First Name")}
        />
        <InputGroup
          label={tran("Last Name")}
          name="last_name"
          value={updateProfileInfo.last_name}
          onChange={(e) =>
            setUpdateProfileInfo((prev) => ({
              ...prev,
              last_name: e,
            }))
          }
          errors={errors}
          placeholder={tran("Enter New Last Name")}
        />
        <InputGroup
          label={tran("User Name")}
          name="username"
          value={updateProfileInfo.username}
          onChange={(e) =>
            setUpdateProfileInfo((prev) => ({
              ...prev,
              username: e,
            }))
          }
          errors={errors}
          placeholder={tran("Enter New User Name")}
        />

        <InputGroup
          label={tran("Address")}
          name="address"
          value={updateProfileInfo.address}
          onChange={(e) =>
            setUpdateProfileInfo((prev) => ({
              ...prev,
              address: e,
            }))
          }
          errors={errors}
          placeholder={tran("Enter Your Address")}
        />
        <div className="w-full pt-3">
          <Button
            type="submit"
            className="w-full"
            loading={profileInfoUpdateLoading}
          >
            {tran("Save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserProfile;
