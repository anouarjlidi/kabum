<?php

/**
 * Copyright 2019 Douglas Silva (0x9fd287d56ec107ac)
 *
 * This file is part of KaBuM!.
 *
 * KaBuM! is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KaBuM!.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Knp\Component\Pager\PaginatorInterface;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    private $paginator;

    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Product::class);

        $this->paginator = $paginator;
    }

    public function findBySearchQuery(string $query, int $page, int $itemsPerPage)
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT * FROM product WHERE MATCH (name) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)';
        $stmt = $conn->prepare($sql);
        $stmt->execute(['searchTerm' => $query]);

        return $this->paginator->paginate($stmt->fetchAll(), $page, $itemsPerPage);
    }

    public function findByInstantSearchQuery(string $query)
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT * FROM product WHERE MATCH (name) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE) LIMIT 3';
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':searchTerm', $query);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
