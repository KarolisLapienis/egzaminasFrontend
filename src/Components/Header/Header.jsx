/** @format */

import React, { useEffect, useState } from "react";
import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  Divider,
  Center,
  Box,
  Burger,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";

const Header = ({ user, setUser, onCategorySelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Error fetching categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, [user]);

  const links = categories.map((category) => (
    <UnstyledButton
      className={classes.subLink}
      key={category._id}
      onClick={() => onCategorySelect(category._id)}
    >
      <Text size="sm" fw={500}>
        {category.name}
      </Text>
    </UnstyledButton>
  ));

  const shouldShowCategoryDropdown =
    location.pathname.includes("/blockAdPage") ||
    location.pathname.includes("/favoriteAds") ||
    location.pathname.includes("/myAds") ||
    location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setCategories([]);
  };

  return (
    <Box pb={40} mt={20}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group h="100%" gap={0} visibleFrom="sm">
            <a className={classes.link} href="" onClick={() => navigate("/")}>
              Home
            </a>
            {shouldShowCategoryDropdown && (
              <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Categories
                      </Box>
                      <IconChevronDown
                        style={{ width: rem(16), height: rem(16) }}
                        color={theme.colors.red[6]}
                      />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Categories</Text>
                  </Group>

                  <Divider my="sm" />

                  <SimpleGrid cols={1} spacing={0}>
                    {links}
                  </SimpleGrid>
                </HoverCard.Dropdown>
              </HoverCard>
            )}
          </Group>

          {user && (
            <>
              {user.role === "user" && (
                <>
                  <a
                    href=""
                    className={classes.link}
                    onClick={() => navigate("/favoriteAds")}
                  >
                    Favorite Ads
                  </a>
                  <a
                    href=""
                    className={classes.link}
                    onClick={() => navigate("/myAds")}
                  >
                    My Ads
                  </a>
                  <a
                    href=""
                    className={classes.link}
                    onClick={() => navigate("/createAd")}
                  >
                    Create Ad
                  </a>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <a
                    href=""
                    className={classes.link}
                    onClick={() => navigate("/createCategory")}
                  >
                    Add new category
                  </a>
                  <a
                    href=""
                    className={classes.link}
                    onClick={() => navigate("/blockAdPage")}
                  >
                    Block ad
                  </a>
                  <a
                    href=""
                    className={classes.link}
                    onClick={() => navigate("/blockUserPage")}
                  >
                    Block user
                  </a>
                </>
              )}
            </>
          )}

          <Group visibleFrom="sm">
            {user ? (
              <Button onClick={handleLogout} variant="default">
                Log out
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="default">
                  Log in
                </Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </>
            )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            aria-label="Toggle menu"
            color={theme.colors.red[6]} 
            hiddenFrom="sm"
          />
        </Group>
        <Divider className={classes.divider} mt="md" />
      </header>
    </Box>
  );
};

export default Header;
